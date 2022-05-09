import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import {AdminProjectRoutingModule} from './admin-project-routing.module';

import {AdminProjectComponent} from './admin-project.component';

import {MessageErrorModule} from '../../../../utility/messages/message-error/message-error.module';
import {BannerModule} from '../../../../utility/banner/banner.module';
import {AdminProjectFollowUpModule} from './admin-project-follow-up/admin-project-follow-up.module';
import {AdminProjectPreparationModule} from './admin-project-preparation/admin-project-preparation.module';
import {AdminProjectAnalysisModule} from './admin-project-analysis/admin-project-analysis.module';
import {AdminProjectSettingsModule} from './admin-project-settings/admin-project-settings.module';
import {AdminProjectCollectionModule} from './admin-project-collection/admin-project-collection.module';
import {SharedActivityModalModule} from '../../../../shared/components/shared-activity-modal/shared-activity-modal.module';
import {ModalModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    MessageErrorModule,
    BannerModule,
    AdminProjectFollowUpModule,
    AdminProjectPreparationModule,
    AdminProjectAnalysisModule,
    AdminProjectSettingsModule,
    AdminProjectCollectionModule,
    AdminProjectRoutingModule,
    SharedActivityModalModule,
    ModalModule,
  ],
  declarations: [
    AdminProjectComponent,
  ],
  exports: [
    AdminProjectComponent,
  ]
})

export class AdminProjectModule {}
