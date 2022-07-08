import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MemoryDataSource} from '../datasources';
import {Stages, StagesRelations} from '../models';

export class StagesRepository extends DefaultCrudRepository<
  Stages,
  typeof Stages.prototype.id,
  StagesRelations
> {
  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
  ) {
    super(Stages, dataSource);
  }
}
