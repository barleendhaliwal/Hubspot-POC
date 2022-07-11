import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Company, Deal} from '../models';
import {DealRepository} from '../repositories';

export class DealCompanyController {
  constructor(
    @repository(DealRepository) protected dealRepository: DealRepository,
  ) {}

  @get('/deals/{id}/company', {
    responses: {
      '200': {
        description: 'Deal has one Company',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Company),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Company>,
  ): Promise<Company> {
    return this.dealRepository.company(id).get(filter);
  }

  @post('/deals/{id}/company', {
    responses: {
      '200': {
        description: 'Deal model instance',
        content: {'application/json': {schema: getModelSchemaRef(Company)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Deal.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {
            title: 'NewCompanyInDeal',
            exclude: ['id'],
          }),
        },
      },
    })
    company: Omit<Company, 'id'>,
  ): Promise<Company> {
    return this.dealRepository.company(id).create(company);
  }

  @patch('/deals/{id}/company', {
    responses: {
      '200': {
        description: 'Deal.Company PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {partial: true}),
        },
      },
    })
    company: Partial<Company>,
    @param.query.object('where', getWhereSchemaFor(Company))
    where?: Where<Company>,
  ): Promise<Count> {
    return this.dealRepository.company(id).patch(company, where);
  }

  @del('/deals/{id}/company', {
    responses: {
      '200': {
        description: 'Deal.Company DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Company))
    where?: Where<Company>,
  ): Promise<Count> {
    return this.dealRepository.company(id).delete(where);
  }
}
