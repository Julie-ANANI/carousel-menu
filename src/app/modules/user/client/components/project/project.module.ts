import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { ProjectComponent } from './project.component';
import { SetupComponent } from './components/setup/setup.component';
import { ExplorationComponent } from './components/exploration/exploration.component';
import { SurveyComponent } from './components/setup/components/survey/survey.component';
import { HistoryProjectComponent } from './components/history/history.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarModule } from '../../../../sidebar/sidebar.module';
import { SidebarCollaboratorModule } from '../../../../sidebar/components/collaborator/sidebar-collaborator.module';
import { SharedProjectSettingsModule } from '../../../../shared/components/shared-project-settings-component/shared-project-settings.module';
import { SharedProjectEditCardsModule } from '../../../../shared/components/shared-project-edit-cards-component/shared-project-edit-cards.module';
import { SidebarInnovationPreviewModule } from '../../../../sidebar/components/innovation-preview/sidebar-innovation-preview.module';
import { TableModule } from '../../../../table/table.module';
import { SharedWorldmapModule } from '../../../../shared/components/shared-worldmap/shared-worldmap.module';
import { SidebarUserAnswerModule } from '../../../../sidebar/components/user-answer/sidebar-user-answer.module';
import { SharedMarketReportModule } from '../../../../shared/components/shared-market-report/shared-market-report.module';
import { MessageTemplate1Module } from '../../../../utility-components/messages/message-template-1/message-template-1.module';
import { ModalModule } from '../../../../utility-components/modals/modal/modal.module';


@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,
    TranslateModule.forChild(),
    PipeModule,
    SidebarModule,
    SidebarCollaboratorModule,
    SharedProjectSettingsModule,
    SharedProjectEditCardsModule,
    SidebarInnovationPreviewModule,
    TableModule,
    SharedWorldmapModule,
    SidebarUserAnswerModule,
    SharedMarketReportModule,
    MessageTemplate1Module,
    ModalModule
  ],
  declarations: [
    ProjectComponent,
    SetupComponent,
    ExplorationComponent,
    SurveyComponent,
    HistoryProjectComponent
  ],
  exports: [
    ProjectComponent
  ]
})

export class ProjectModule {}
