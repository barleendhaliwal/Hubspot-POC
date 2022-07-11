import {Entity, model, property} from '@loopback/repository';

@model()
export class Deal extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @property({
    type: 'string',
  })
  dealType?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  hsOwnerId?: string;

  @property({
    type: 'string',
    required: true,
  })
  parentDealId: string;

  @property({
    type: 'boolean',
    required: true,
  })
  archived: boolean;

  @property({
    type: 'string',
  })
  companyId?: string;

  @property({
    type: 'string',
  })
  clientId?: string;

  constructor(data?: Partial<Deal>) {
    super(data);
  }
}

export interface DealRelations {
  // describe navigational properties here
}

export type DealWithRelations = Deal & DealRelations;
