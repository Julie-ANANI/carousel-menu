import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AdminProjectPreparationComponent} from './admin-project-preparation.component';
import {AdminProjectCampaignsModule} from '../admin-project-campaigns/admin-project-campaigns.module';
import {AdminProjectQuestionnaireModule} from '../admin-project-questionnaire/admin-project-questionnaire.module';
import {AdminProjectTargetingModule} from '../admin-project-targeting/admin-project-targeting.module';
import {AdminProjectDescriptionModule} from '../admin-project-description/admin-project-description.module';
import {AdminCampaignsModule} from '../../admin-campaigns/admin-campaigns.module';
import {AdminProjectStatisticsModule} from '../admin-project-statistics/admin-project-statistics.module';
import {ModalModule} from '@umius/umi-common-component';
import {MenuCarouselModule} from '../../../../../utility/menu-carousel/menu-carousel.module';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminProjectCampaignsModule,
    AdminProjectQuestionnaireModule,
    AdminProjectTargetingModule,
    AdminProjectDescriptionModule,
    AdminProjectStatisticsModule,
    AdminCampaignsModule,
    ModalModule,
    FormsModule,
    TranslateModule,
    MenuCarouselModule
  ],
  declarations: [
    AdminProjectPreparationComponent
  ],
  exports: [
    AdminProjectPreparationComponent
  ]
})

export class AdminProjectPreparationModule {}
