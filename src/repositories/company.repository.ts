import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Company, CompanyRelations, Deal} from '../models';
import {DealRepository} from './deal.repository';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> {

  public readonly deals: HasManyRepositoryFactory<Deal, typeof Company.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('DealRepository') protected dealRepositoryGetter: Getter<DealRepository>,
  ) {
    super(Company, dataSource);
    this.deals = this.createHasManyRepositoryFactoryFor('deals', dealRepositoryGetter,);
    this.registerInclusionResolver('deals', this.deals.inclusionResolver);
  }
}
