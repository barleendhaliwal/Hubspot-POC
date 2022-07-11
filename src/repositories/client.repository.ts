import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Client, ClientRelations, Deal} from '../models';
import {DealRepository} from './deal.repository';

export class ClientRepository extends DefaultCrudRepository<
  Client,
  typeof Client.prototype.id,
  ClientRelations
> {

  public readonly deals: HasManyRepositoryFactory<Deal, typeof Client.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('DealRepository') protected dealRepositoryGetter: Getter<DealRepository>,
  ) {
    super(Client, dataSource);
    this.deals = this.createHasManyRepositoryFactoryFor('deals', dealRepositoryGetter,);
    this.registerInclusionResolver('deals', this.deals.inclusionResolver);
  }
}
