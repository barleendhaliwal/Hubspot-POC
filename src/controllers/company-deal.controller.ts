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
import {
  Company,
  Deal,
} from '../models';
import {CompanyRepository} from '../repositories';

export class CompanyDealController {
  constructor(
    @repository(CompanyRepository) protected companyRepository: CompanyRepository,
  ) { }

  @get('/companies/{id}/deals', {
    responses: {
      '200': {
        description: 'Array of Company has many Deal',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Deal)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Deal>,
  ): Promise<Deal[]> {
    return this.companyRepository.deals(id).find(filter);
  }

  @post('/companies/{id}/deals', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: {'application/json': {schema: getModelSchemaRef(Deal)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Company.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deal, {
            title: 'NewDealInCompany',
            exclude: ['id'],
            optional: ['companyId']
          }),
        },
      },
    }) deal: Omit<Deal, 'id'>,
  ): Promise<Deal> {
    return this.companyRepository.deals(id).create(deal);
  }

  @patch('/companies/{id}/deals', {
    responses: {
      '200': {
        description: 'Company.Deal PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deal, {partial: true}),
        },
      },
    })
    deal: Partial<Deal>,
    @param.query.object('where', getWhereSchemaFor(Deal)) where?: Where<Deal>,
  ): Promise<Count> {
    return this.companyRepository.deals(id).patch(deal, where);
  }

  @del('/companies/{id}/deals', {
    responses: {
      '200': {
        description: 'Company.Deal DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Deal)) where?: Where<Deal>,
  ): Promise<Count> {
    return this.companyRepository.deals(id).delete(where);
  }
}
