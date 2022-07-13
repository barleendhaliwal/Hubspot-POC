// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {
  ClientRepository,
  CompanyRepository,
  DealRepository,
  PipelineStageRepository,
} from '../repositories';
// import {StagesRepository} from '../repositories';
import {
  HubSpotApiService,
  MasterDataStoreService,
  OAuthHubSpotService,
} from '../services';

export class PocController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
    @inject('services.OAuthHubSpotService')
    private oAuthHubSpotService: OAuthHubSpotService,
    @inject('services.HubSpotApiService')
    private hubSpotApiService: HubSpotApiService,
    @inject('services.MasterDataStoreService')
    private masterDataStoreService: MasterDataStoreService,
    @repository(PipelineStageRepository)
    private pipelineStageRepository: PipelineStageRepository,
    @repository(CompanyRepository) private companyRepository: CompanyRepository,
    @repository(ClientRepository) private clientRepository: ClientRepository,
    @repository(DealRepository) private dealRepository: DealRepository, // @repository('StagesRepository') private stagesRepository: StagesRepository,
  ) {}

  @get('/oauth-callback')
  async OauthAuthToken() {
    const code = this.req.query.code;
    await this.oAuthHubSpotService.getAccessToken(code as string);
    const stages = await this.hubSpotApiService.getDealStages();
    await this.masterDataStoreService.saveStageDataToDb(stages);
  }

  @post('/webhook')
  async webHookEvents(@requestBody() data: any[]) {
    console.log('******WEBHOOK RECEIVED DATA**********', this.req.body);

    const id = this.req.body[0].propertyValue;
    const exists = await this.pipelineStageRepository.exists(id);

    if (!exists) {
      return;
    }
    const dealInfo = await this.hubSpotApiService.getDealDetails(
      `${this.req.body[0].objectId}`,
    );

    const companyInfo = await this.hubSpotApiService.getCompanyDetails(
      dealInfo.associations?.companies.results[0].id as string,
    );

    const clientInfo = await this.hubSpotApiService.getContactDetails(
      dealInfo.associations?.contacts.results[0].id as string,
    );

    //save to db
    const updateClient = await this.clientRepository.exists(clientInfo.id);
    const paylaodClient = {
      id: clientInfo.id,
      city: clientInfo.properties.city,
      email: clientInfo.properties.email,
      jobTitle: clientInfo.properties.jobtitle,
      phone: clientInfo.properties.phone,
      createdAt: clientInfo.createdAt,
      updatedAt: clientInfo.updatedAt,
      archived: clientInfo.archived,
    };
    if (updateClient) {
      this.clientRepository.updateById(clientInfo.id, paylaodClient);
    } else {
      this.clientRepository.create(paylaodClient);
    }

    const updateCompany = await this.companyRepository.exists(companyInfo.id);
    const paylaodCompany = {
      id: companyInfo.id,
      city: companyInfo.properties.city,
      domain: companyInfo.properties.domain,
      name: companyInfo.properties.name,
      archived: companyInfo.archived,
      updatedAt: companyInfo.updatedAt,
      createdAt: companyInfo.createdAt,
    };
    if (updateCompany) {
      this.companyRepository.updateById(companyInfo.id, paylaodCompany);
    } else {
      this.companyRepository.create(paylaodCompany);
    }

    const dealUpdate = await this.dealRepository.exists(dealInfo.id);
    const payloadDeal = {
      id: dealInfo.id,
      createdAt: dealInfo.createdAt,
      updatedAt: dealInfo.updatedAt,
      dealType: dealInfo.properties.dealtype,
      description: dealInfo.properties.description,
      hsOwnerId: dealInfo.properties.hubspot_owner_id,
      parentDealId: dealInfo.properties.parent_deal_id,
      archived: dealInfo.archived,
      companyId: companyInfo.id,
      clientId: clientInfo.id,
    };
    if (dealUpdate) {
      this.dealRepository.updateById(dealInfo.id, payloadDeal);
    } else {
      this.dealRepository.create(payloadDeal);
    }
    console.log(
      '***************SAVED DEAL INFORMATION************\n',
      dealInfo,
    );
    console.log(
      '***************SAVED COMPANY INFORMATION************\n',
      companyInfo,
    );
    console.log(
      '***************SAVED CLIENT INFORMATION************\n',
      clientInfo,
    );
  }
}
