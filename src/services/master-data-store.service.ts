import {PipelineStage} from '@hubspot/api-client/lib/codegen/crm/pipelines';
import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {Stages} from '../models';
import {StagesRepository} from '../repositories';
import {stagesToConsider} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class MasterDataStoreService {
  constructor(
    @repository('StagesRepository') private stagesRepository: StagesRepository,
  ) {}

  saveStageDataToDb(stages: PipelineStage[]) {
    const payload:
      | DataObject<Stages>[]
      | {key: stagesToConsider; key_id: string}[] = [];
    stages.forEach(stage => {
      if (stage.label === 'Proposal Made') {
        payload.push({key: stagesToConsider.ProposalMade, key_id: stage.id});
      } else if (stage.label === 'Negotiations Started') {
        payload.push({
          key: stagesToConsider.NegotiationStarted,
          key_id: stage.id,
        });
      } else if (stage.label === 'Closed Lost') {
        payload.push({key: stagesToConsider.ClosedLost, key_id: stage.id});
      } else {
        payload.push({key: stagesToConsider.ClosedWon, key_id: stage.id});
      }
    });
    this.stagesRepository.createAll(payload);
  }
}
