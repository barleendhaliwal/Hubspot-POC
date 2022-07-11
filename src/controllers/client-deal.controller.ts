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
  Client,
  Deal,
} from '../models';
import {ClientRepository} from '../repositories';

export class ClientDealController {
  constructor(
    @repository(ClientRepository) protected clientRepository: ClientRepository,
  ) { }

  @get('/clients/{id}/deals', {
    responses: {
      '200': {
        description: 'Array of Client has many Deal',
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
    return this.clientRepository.deals(id).find(filter);
  }

  @post('/clients/{id}/deals', {
    responses: {
      '200': {
        description: 'Client model instance',
        content: {'application/json': {schema: getModelSchemaRef(Deal)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Client.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deal, {
            title: 'NewDealInClient',
            exclude: ['id'],
            optional: ['clientId']
          }),
        },
      },
    }) deal: Omit<Deal, 'id'>,
  ): Promise<Deal> {
    return this.clientRepository.deals(id).create(deal);
  }

  @patch('/clients/{id}/deals', {
    responses: {
      '200': {
        description: 'Client.Deal PATCH success count',
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
    return this.clientRepository.deals(id).patch(deal, where);
  }

  @del('/clients/{id}/deals', {
    responses: {
      '200': {
        description: 'Client.Deal DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Deal)) where?: Where<Deal>,
  ): Promise<Count> {
    return this.clientRepository.deals(id).delete(where);
  }
}
