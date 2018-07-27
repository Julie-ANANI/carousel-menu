import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { SharedMarketReportModule } from '../../../shared/components/shared-market-report/shared-market-report.module';
import { SharedSortModule } from '../../../shared/components/shared-sort/shared-sort.module';
import { SharedTextZoneModule } from '../../../shared/components/shared-text-zone/shared-text-zone.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { AdminProjectComponent } from './admin-project.component';
import { AdminProjectDetailsComponent } from './admin-project-details/admin-project-details.component';
import { AdminProjectCardsComponent } from './admin-project-cards/admin-project-cards.component';
import { AdminProjectCampaignsComponent } from './admin-project-campaigns/admin-project-campaigns.component';
import { AdminProjectSynthesisComponent } from './admin-project-synthesis/admin-project-synthesis.component';
import { AdminProjectTagsPoolComponent } from './admin-project-tags-pool/admin-project-tags-pool.component';
import { InputModule } from '../../../input/input.module';
import { SharedProjectEditCardsModule } from '../../../shared/components/shared-project-edit-cards-component/shared-project-edit-cards.module';
import { SharedProjectSettingsModule } from '../../../shared/components/shared-project-settings-component/shared-project-settings.module';
import { SharedTagItemModule } from '../../../shared/components/shared-tag-item/shared-tag-item.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AdminProjectQuestionnaireModule} from './admin-project-questionnaire/admin-project-questionnaire.module';

@NgModule({
  imports: [
    CommonModule,
    SharedSortModule,
    SharedTextZoneModule,
    SharedMarketReportModule,
    TranslateModule.forChild(),
    Ng2AutoCompleteModule,
    PipeModule,
    InputModule,
    SharedProjectEditCardsModule,
    SharedProjectSettingsModule,
    SharedTagItemModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminProjectQuestionnaireModule
  ],
  declarations: [
    AdminProjectComponent,
    AdminProjectDetailsComponent,
    AdminProjectCardsComponent,
    AdminProjectCampaignsComponent,
    AdminProjectSynthesisComponent,
    AdminProjectTagsPoolComponent
  ],
  exports: [
    AdminProjectComponent
  ]
})

export class AdminProjectModule {}
