import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSortModule } from '../../../shared/components/shared-sort/shared-sort.module';
import { SharedMarketReportModule } from '../../../shared/components/shared-market-report/shared-market-report.module';
import { SharedWorldmapModule } from '../../../shared/components/shared-worldmap/shared-worldmap.module';
import { SharedProjectsListModule } from '../../../admin/components/admin-projects-list/admin-projects-list.module';
import { SharedPaginationModule } from '../../../shared/components/shared-pagination/shared-pagination.module';
import { SharedAnswerListModule } from '../../../shared/components/shared-answers-list/shared-answer-list.module';
import { SharedLoaderModule } from '../../../shared/components/shared-loader/shared-loader.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { SidebarModule } from '../../../sidebar/sidebar.module';
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
import { SharedProjectEditCardsModule } from '../../../shared/components/shared-project-edit-cards-component/shared-project-edit-cards.module';
import { SharedProjectSettingsModule } from '../../../shared/components/shared-project-settings-component/shared-project-settings.module';
import { SharedProjectDescriptionModule } from '../../../shared/components/shared-project-description/shared-project-description.module';
import { TableModule } from '../../../table/table.module';

@NgModule({
  imports: [
    CommonModule,
    SharedSortModule,
    SharedPaginationModule,
    SharedMarketReportModule,
    SharedAnswerListModule,
    SharedProjectsListModule,
    SharedWorldmapModule,
    TableModule,
    TranslateModule.forChild(),
    SidebarModule,
    SharedLoaderModule,
    PipeModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedProjectEditCardsModule,
    SharedProjectSettingsModule,
    SharedProjectDescriptionModule
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
