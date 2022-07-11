import {Entity, model, property} from '@loopback/repository';

@model()
export class PipelineStage extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  label: string;

  @property({
    type: 'number',
    required: true,
  })
  displayOrder: number;

  @property({
    type: 'string',
    id: true,
  })
  id?: string;

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

  constructor(data?: Partial<PipelineStage>) {
    super(data);
  }
}

export interface PipelineStageRelations {
  // describe navigational properties here
}

export type PipelineStageWithRelations = PipelineStage & PipelineStageRelations;
