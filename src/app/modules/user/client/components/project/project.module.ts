import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { ProjectComponent } from './project.component';
import { SetupComponent } from './components/setup/setup.component';
import { ExplorationComponent } from './components/exploration/exploration.component';
import { TargetingComponent } from './components/setup/components/targeting/targeting.component';
import { PitchComponent } from './components/setup/components/pitch/pitch.component';
import { SurveyComponent } from './components/setup/components/survey/survey.component';
import { HistoryProjectComponent } from './components/history/history.component';
import { ProjectEditExample1Component } from './components/project-edit-example1/project-edit-example1.component';
import { ProjectEditExample2Component } from './components/project-edit-example2/project-edit-example2.component';

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
import { SharedProjectDescriptionModule } from '../../../../shared/components/shared-project-description/shared-project-description.module';


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
    SharedProjectDescriptionModule
  ],
  declarations: [
    ProjectComponent,
    SetupComponent,
    ExplorationComponent,
    TargetingComponent,
    PitchComponent,
    SurveyComponent,
    HistoryProjectComponent,
    ProjectEditExample1Component,
    ProjectEditExample2Component
  ],
  exports: [
    ProjectComponent
  ]
})

export class ProjectModule {}
