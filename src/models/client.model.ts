import {Entity, hasMany, model, property} from '@loopback/repository';
import {Deal} from './deal.model';

@model()
export class Client extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  city: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  jobTitle?: string;

  @property({
    type: 'string',
  })
  phone?: string;

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
    type: 'boolean',
    required: true,
  })
  archived: boolean;

  @hasMany(() => Deal)
  deals: Deal[];

  constructor(data?: Partial<Client>) {
    super(data);
  }
}

export interface ClientRelations {
  // describe navigational properties here
}

export type ClientWithRelations = Client & ClientRelations;
