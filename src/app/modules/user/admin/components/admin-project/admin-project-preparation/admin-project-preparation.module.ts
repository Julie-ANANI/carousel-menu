import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {AdminProjectPreparationComponent} from './admin-project-preparation.component';
import {ModalEmptyModule} from '../../../../../utility/modals/modal-empty/modal-empty.module';
import {AdminProjectCampaignsModule} from '../admin-project-campaigns/admin-project-campaigns.module';
import {AdminProjectQuestionnaireModule} from '../admin-project-questionnaire/admin-project-questionnaire.module';
import {AdminProjectTargetingModule} from '../admin-project-targeting/admin-project-targeting.module';
import {AdminProjectDescriptionModule} from '../admin-project-description/admin-project-description.module';
import {AdminCampaignsModule} from '../../admin-campaigns/admin-campaigns.module';
import {AdminProjectStatisticsModule} from '../admin-project-statistics/admin-project-statistics.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ModalEmptyModule,
    AdminProjectCampaignsModule,
    AdminProjectQuestionnaireModule,
    AdminProjectTargetingModule,
    AdminProjectDescriptionModule,
    AdminProjectStatisticsModule,
    AdminCampaignsModule
  ],
  declarations: [
    AdminProjectPreparationComponent
  ],
  exports: [
    AdminProjectPreparationComponent
  ]
})

export class AdminProjectPreparationModule {}
