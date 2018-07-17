import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { SharedSortModule } from '../../../shared/components/shared-sort/sort.module';
import { SharedMarketReportModule } from '../../../shared/components/shared-market-report/shared-market-report.module';
import { SharedWorldmapModule } from '../../../shared/components/shared-worldmap/shared-worldmap.module';
import { SharedProjectsListModule } from '../../../admin/components/admin-projects-list/admin-projects-list.module';
import { SharedPaginationModule } from '../../../shared/components/shared-pagination/pagination.module';
import { SharedAnswerListModule } from '../../../shared/components/shared-answers-list/shared-answer-list.module';
import { SidebarModule } from '../../../shared/components/shared-sidebar/sidebar.module';
import { SharedLoaderModule } from '../../../shared/components/shared-loader/shared-loader.module';

/* Components */
import { ClientProjectComponent } from './client-project.component';
import { ExplorationProjectComponent } from './components/exploration/exploration.component';
import { HistoryProjectComponent } from './components/history/history.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { ProjectEditExample1Component } from './components/project-edit-example1/project-edit-example1.component';
import { ProjectEditExample2Component } from './components/project-edit-example2/project-edit-example2.component';
import { SetupProjectComponent } from './components/setup/setup.component';
import { PitchComponent } from './components/setup/components/pitch/pitch.component';
import { SurveyComponent } from './components/setup/components/survey/survey.component';
import { TargetingComponent } from './components/setup/components/targeting/targeting.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedSortModule,
    SharedPaginationModule,
    SharedMarketReportModule,
    SharedAnswerListModule,
    SharedProjectsListModule,
    SharedWorldmapModule,
    TranslateModule.forChild(),
    SidebarModule,
    SharedLoaderModule
  ],
  declarations: [
    ClientProjectComponent,
    ExplorationProjectComponent,
    HistoryProjectComponent,
    NewProjectComponent,
    ProjectEditExample1Component,
    ProjectEditExample2Component,
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
