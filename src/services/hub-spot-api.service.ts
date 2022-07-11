import {Client} from '@hubspot/api-client';
import {/* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {accessToken, exp, OAuthHubSpotService} from './o-auth-hub-spot.service';

@injectable({scope: BindingScope.TRANSIENT})
export class HubSpotApiService {
  constructor(
    @inject('services.OAuthHubSpotService')
    private oAuthHubSpotService: OAuthHubSpotService,
  ) {}

  async getDealDetails(dealId: string) {
    await this.checkAndUpdateAccessToken();

    const hubspotClient = new Client({accessToken: accessToken});

    const deals = await hubspotClient.crm.deals.basicApi.getById(
      dealId,
      [
        'dealtype',
        'deal_name',
        'hubspot_owner_id',
        'description',
        'custom_property',
        'parent_deal_id',
      ],
      undefined,
      ['contacts', 'company'],
    );

    return deals;
  }

  async getCompanyDetails(companyId: string) {
    await this.checkAndUpdateAccessToken();
    const hubspotClient = new Client({accessToken: accessToken});
    const company = await hubspotClient.crm.companies.basicApi.getById(
      companyId,
      ['city', 'name', 'domain'],
    );
    return company;
  }
  async getContactDetails(contactId: string) {
    await this.checkAndUpdateAccessToken();
    const hubspotClient = new Client({accessToken: accessToken});
    const contact = await hubspotClient.crm.contacts.basicApi.getById(
      contactId,
      ['jobtitle', 'city', 'email', 'phone'],
    );
    return contact;
  }

  async getDealStages() {
    await this.checkAndUpdateAccessToken();
    const hubspotClient = new Client({accessToken: accessToken});
    const salesPipelineName = 'Sourcefuse Deal Pipeline';
    const pipelines = await hubspotClient.crm.pipelines.pipelinesApi.getAll(
      'deals',
    );
    const salesPipeline = pipelines.results.find(
      pipeline => pipeline.label === salesPipelineName,
    );

    const allStages =
      await hubspotClient.crm.pipelines.pipelineStagesApi.getAll(
        'deals',
        salesPipeline!.id,
      );
    const stages = allStages.results.filter(
      stage =>
        stage.label === 'Proposal Made' ||
        stage.label === 'Negotiations Started' ||
        stage.label === 'Closed Lost' ||
        stage.label === 'Closed Won',
    );
    return stages;
  }

  async checkAndUpdateAccessToken() {
    if (exp <= Date.now()) {
      await this.oAuthHubSpotService.updateAccessToken();
    }
  }
}
