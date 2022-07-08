// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, post, Request, requestBody, RestBindings} from '@loopback/rest';
import {StagesRepository} from '../repositories';
import {
  HubSpotApiService,
  MasterDataStoreService,
  OAuthHubSpotService,
} from '../services';

// import {inject} from '@loopback/core';

export class PocController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject('services.OAuthHubSpotService')
    private oAuthHubSpotService: OAuthHubSpotService,
    @inject('services.HubSpotApiService')
    private hubSpotApiService: HubSpotApiService,
    @inject('services.MasterDataStoreService')
    private masterDataStoreService: MasterDataStoreService,
    @repository('StagesRepository') private stagesRepository: StagesRepository,
  ) {}

  @get('/oauth-callback')
  async OauthAuthToken() {
    const code = this.req.query.code;
    await this.oAuthHubSpotService.getAccessToken(code as string);
    const stages = await this.hubSpotApiService.getDealStages();
    this.masterDataStoreService.saveStageDataToDb(stages);
  }

  @post('/webhook')
  async webHookEvents(@requestBody() data: any[]) {
    console.log(this.req.body);
    const id = this.req.body[0].propertyValue;
    const dealInfo = await this.hubSpotApiService.getDealDetails(
      `${this.req.body[0].objectId}`,
    );

    const companyInfo = await this.hubSpotApiService.getCompanyDetails(
      dealInfo.associations?.companies.results[0].id as string,
    );

    const contactInfo = await this.hubSpotApiService.getContactDetails(
      dealInfo.associations?.contacts.results[0].id as string,
    );
    console.log('DEAL INFORMATION', dealInfo);
    console.log('COMPANY INFORMATION', companyInfo);
    console.log('CLIENT INFORMATION', contactInfo);
  }
}
