import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedMarketReportModule } from '../../../shared/components/shared-market-report/shared-market-report.module';
import { SharedModule } from '../../../shared/shared.module';
import { ClientProjectComponent } from './client-project.component';
import { ExplorationProjectComponent } from './components/exploration/exploration.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { ProjectEditComponent } from './components/project-edit/project-edit.component';
import { ProjectEditExample1Component } from './components/project-edit-example1/project-edit-example1.component';
import { ProjectEditExample2Component } from './components/project-edit-example2/project-edit-example2.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { SetupProjectComponent } from './components/setup/setup.component';
import { SurveyComponent } from './components/setup/components/survey/survey.component';
import { TargetingComponent } from './components/setup/components/targeting/targeting.component';

@NgModule({
  imports: [
    CommonModule,
    SharedMarketReportModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    ClientProjectComponent,
    ExplorationProjectComponent,
    NewProjectComponent,
    ProjectEditComponent,
    ProjectEditExample1Component,
    ProjectEditExample2Component,
    ProjectsListComponent,
    SetupProjectComponent,
    SurveyComponent,
    TargetingComponent
  ],
  exports: [
    ClientProjectComponent
  ]
})

export class ClientProjectModule {}
