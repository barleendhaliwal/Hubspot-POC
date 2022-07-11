import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Deal} from '../models';
import {DealRepository} from '../repositories';

export class DealController {
  constructor(
    @repository(DealRepository)
    public dealRepository : DealRepository,
  ) {}

  @post('/deals')
  @response(200, {
    description: 'Deal model instance',
    content: {'application/json': {schema: getModelSchemaRef(Deal)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deal, {
            title: 'NewDeal',
            
          }),
        },
      },
    })
    deal: Deal,
  ): Promise<Deal> {
    return this.dealRepository.create(deal);
  }

  @get('/deals/count')
  @response(200, {
    description: 'Deal model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Deal) where?: Where<Deal>,
  ): Promise<Count> {
    return this.dealRepository.count(where);
  }

  @get('/deals')
  @response(200, {
    description: 'Array of Deal model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Deal, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Deal) filter?: Filter<Deal>,
  ): Promise<Deal[]> {
    return this.dealRepository.find(filter);
  }

  @patch('/deals')
  @response(200, {
    description: 'Deal PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deal, {partial: true}),
        },
      },
    })
    deal: Deal,
    @param.where(Deal) where?: Where<Deal>,
  ): Promise<Count> {
    return this.dealRepository.updateAll(deal, where);
  }

  @get('/deals/{id}')
  @response(200, {
    description: 'Deal model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Deal, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Deal, {exclude: 'where'}) filter?: FilterExcludingWhere<Deal>
  ): Promise<Deal> {
    return this.dealRepository.findById(id, filter);
  }

  @patch('/deals/{id}')
  @response(204, {
    description: 'Deal PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deal, {partial: true}),
        },
      },
    })
    deal: Deal,
  ): Promise<void> {
    await this.dealRepository.updateById(id, deal);
  }

  @put('/deals/{id}')
  @response(204, {
    description: 'Deal PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() deal: Deal,
  ): Promise<void> {
    await this.dealRepository.replaceById(id, deal);
  }

  @del('/deals/{id}')
  @response(204, {
    description: 'Deal DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.dealRepository.deleteById(id);
  }
}
