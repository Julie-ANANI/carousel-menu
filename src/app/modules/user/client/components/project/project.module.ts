import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { ProjectComponent } from './project.component';
import { SetupComponent } from './components/setup/setup.component';
import { ExplorationComponent } from './components/exploration/exploration.component';
import { TargetingComponent } from './components/setup/components/targeting/targeting.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarModule } from '../../../../sidebar/sidebar.module';
import { SidebarCollaboratorModule } from '../../../../sidebar/components/collaborator/sidebar-collaborator.module';


@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,
    TranslateModule.forChild(),
    PipeModule,
    SidebarModule,
    SidebarCollaboratorModule
  ],
  declarations: [
    ProjectComponent,
    SetupComponent,
    ExplorationComponent,
    TargetingComponent
  ],
  providers: [
  ],
  exports: [
    ProjectComponent
  ]
})

export class ProjectModule {}

// SharedSortModule,
//   SharedMarketReportModule,
//   SharedAnswerListModule,
//   AdminProjectsListModule,
//   SharedWorldmapModule,
//   TableModule,
//   TranslateModule.forChild(),
//   SidebarModule,
//   SharedLoaderModule,
//   PipeModule,
//   RouterModule,
//   FormsModule,
//   ReactiveFormsModule,
//   SharedProjectEditCardsModule,
//   SharedProjectSettingsModule,
//   SharedProjectDescriptionModule,
//   InputModule,
//   PaginationModule,
//   SidebarCollaboratorModule,
//   SidebarInnovationPreviewModule,
// // SharedCarouselModule
//   ProjectComponent,
//   ProjectsListComponent,
//   ExplorationComponent,
//   HistoryProjectComponent,
//   NewProjectComponent,
//   ProjectEditExample1Component,
//   ProjectEditExample2Component,
//   SetupComponent,
//   PitchComponent,
//   SurveyComponent,
//   TargetingComponent
