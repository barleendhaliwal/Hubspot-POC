import {Entity, model, property} from '@loopback/repository';

@model()
export class Stages extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  key: number;

  @property({
    type: 'string',
    required: true,
  })
  key_id: string;

  constructor(data?: Partial<Stages>) {
    super(data);
  }
}

export interface StagesRelations {
  // describe navigational properties here
}

export type StagesWithRelations = Stages & StagesRelations;
