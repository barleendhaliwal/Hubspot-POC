import {PipelineStage} from '@hubspot/api-client/lib/codegen/crm/pipelines';
import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {PipelineStageRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class MasterDataStoreService {
  constructor(
    @repository(PipelineStageRepository)
    private pipelineStageRepository: PipelineStageRepository,
  ) {}

  async saveStageDataToDb(stages: PipelineStage[]) {
    const payload: Partial<PipelineStage>[] = [];
    stages.forEach(stage =>
      payload.push({
        id: stage.id,
        displayOrder: stage.displayOrder,
        label: stage.label,
        createdAt: stage.createdAt,
        updatedAt: stage.updatedAt,
        archived: stage.archived,
      }),
    );
    await this.pipelineStageRepository.createAll(payload);
    console.log('SAVED PIPELINE DATA');
  }
}
