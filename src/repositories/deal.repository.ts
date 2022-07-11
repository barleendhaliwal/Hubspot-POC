import {inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Company, Deal, DealRelations} from '../models';

export class DealRepository extends DefaultCrudRepository<
  Deal,
  typeof Deal.prototype.id,
  DealRelations
> {
  public readonly company: HasOneRepositoryFactory<
    Company,
    typeof Deal.prototype.id
  >;

  constructor(@inject('datasources.postgres') dataSource: PostgresDataSource) {
    super(Deal, dataSource);
  }
}
