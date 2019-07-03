import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminProjectComponent } from './admin-project.component';
import { AdminProjectCardsComponent } from './admin-project-cards/admin-project-cards.component';
import { AdminProjectCampaignsComponent } from './admin-project-campaigns/admin-project-campaigns.component';
import { AdminProjectSynthesisComponent } from './admin-project-synthesis/admin-project-synthesis.component';
import { AdminProjectTagsPoolComponent } from './admin-project-tags-pool/admin-project-tags-pool.component';
import { AdminProjectManagementComponent } from './admin-project-management/admin-project-management.component';

import { NguiAutoCompleteModule } from '../../../../utility-components/auto-complete/auto-complete.module';
import { SharedMarketReportModule } from '../../../../shared/components/shared-market-report/shared-market-report.module';
import { SharedSortModule } from '../../../../shared/components/shared-sort/shared-sort.module';
import { SharedTextZoneModule } from '../../../../shared/components/shared-text-zone/shared-text-zone.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { SharedProjectEditCardsModule } from '../../../../shared/components/shared-project-edit-cards-component/shared-project-edit-cards.module';
import { SharedProjectSettingsModule } from '../../../../shared/components/shared-project-settings-component/shared-project-settings.module';
import { SharedTagItemModule } from '../../../../shared/components/shared-tag-item/shared-tag-item.module';
import { TableModule } from '../../../../table/table.module';
import { AdminProjectQuestionnaireModule } from './admin-project-questionnaire/admin-project-questionnaire.module';
import { AutocompleteInputModule } from '../../../../utility-components/autocomplete-input/autocomplete-input.module';
import { SidebarModule } from '../../../../sidebar/sidebar.module';
import { ProgressBarModule } from '../../../../utility-components/progress-bar/progress-bar.module';
import { SidebarTagsModule } from '../../../../sidebar/components/tags/sidebar-tags.module';
import { SidebarEmailFormModule } from '../../../../sidebar/components/emails-form/sidebar-email-form.module';
import { SidebarInnovationFormModule } from '../../../../sidebar/components/innovation-form/sidebar-innovation-form.module';
import { SidebarCampaignFormModule } from '../../../../sidebar/components/campaign-form/sidebar-campaign-form.module';
import { MessageTemplate1Module } from '../../../../utility-components/messages/message-template-1/message-template-1.module';
import { ModalModule } from '../../../../utility-components/modals/modal/modal.module';
import { ErrorTemplate1Module } from '../../../../utility-components/errors/error-template-1/error-template-1.module';
import { MessageTemplate2Module } from '../../../../utility-components/messages/message-template-2/message-template-2.module';

@NgModule({
  imports: [
    CommonModule,
    SharedSortModule,
    SharedTextZoneModule,
    SharedMarketReportModule,
    TranslateModule.forChild(),
    NguiAutoCompleteModule,
    PipeModule,
    SharedProjectEditCardsModule,
    SharedProjectSettingsModule,
    SharedTagItemModule,
    TableModule,
    RouterModule,
    SidebarModule,
    FormsModule,
    AutocompleteInputModule,
    ReactiveFormsModule,
    AdminProjectQuestionnaireModule,
    ProgressBarModule,
    SidebarTagsModule,
    SidebarEmailFormModule,
    SidebarInnovationFormModule,
    SidebarCampaignFormModule,
    MessageTemplate1Module,
    ModalModule,
    ErrorTemplate1Module,
    MessageTemplate2Module
  ],
  declarations: [
    AdminProjectComponent,
    AdminProjectCardsComponent,
    AdminProjectCampaignsComponent,
    AdminProjectSynthesisComponent,
    AdminProjectTagsPoolComponent,
    AdminProjectManagementComponent
  ],
  exports: [
    AdminProjectComponent
  ]
})

export class AdminProjectModule {}
