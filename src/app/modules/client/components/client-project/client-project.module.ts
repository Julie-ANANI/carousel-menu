import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { SharedAnswerModalModule } from '../../../shared/components/shared-answer-modal/answer-modal.module';
import { SharedMarketReportModule } from '../../../shared/components/shared-market-report/shared-market-report.module';
import { SharedWorldmapModule } from '../../../shared/components/shared-worldmap/shared-worldmap.module';
import { ClientProjectComponent } from './client-project.component';
import { ExplorationProjectComponent } from './components/exploration/exploration.component';
import { HistoryProjectComponent } from './components/history/history.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { ProjectEditExample1Component } from './components/project-edit-example1/project-edit-example1.component';
import { ProjectEditExample2Component } from './components/project-edit-example2/project-edit-example2.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { SetupProjectComponent } from './components/setup/setup.component';
import { PitchComponent } from './components/setup/components/pitch/pitch.component';
import { SurveyComponent } from './components/setup/components/survey/survey.component';
import { TargetingComponent } from './components/setup/components/targeting/targeting.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedAnswerModalModule,
    SharedMarketReportModule,
    SharedWorldmapModule,
    TranslateModule.forChild()
  ],
  declarations: [
    ClientProjectComponent,
    ExplorationProjectComponent,
    HistoryProjectComponent,
    NewProjectComponent,
    ProjectEditExample1Component,
    ProjectEditExample2Component,
    ProjectsListComponent,
    SetupProjectComponent,
    PitchComponent,
    SurveyComponent,
    TargetingComponent
  ],
  exports: [
    ClientProjectComponent
  ]
})

export class ClientProjectModule {}
