import {Entity, hasMany, model, property} from '@loopback/repository';
import {Deal} from './deal.model';

@model()
export class Company extends Entity {
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
  domain: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'boolean',
    required: true,
  })
  archived: boolean;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @hasMany(() => Deal)
  deals: Deal[];

  constructor(data?: Partial<Company>) {
    super(data);
  }
}

export interface CompanyRelations {
  // describe navigational properties here
}

export type CompanyWithRelations = Company & CompanyRelations;
