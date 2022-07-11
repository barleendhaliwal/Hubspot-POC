import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {PipelineStage, PipelineStageRelations} from '../models';

export class PipelineStageRepository extends DefaultCrudRepository<
  PipelineStage,
  typeof PipelineStage.prototype.id,
  PipelineStageRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(PipelineStage, dataSource);
  }
}
