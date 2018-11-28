import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectComponent } from './project.component';

import { ProjectRoutingModule } from './project-routing.module';
import { SetupComponent } from './components/setup/setup.component';

@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule

  ],
  declarations: [
    ProjectComponent,
    SetupComponent
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
//   ExplorationProjectComponent,
//   HistoryProjectComponent,
//   NewProjectComponent,
//   ProjectEditExample1Component,
//   ProjectEditExample2Component,
//   SetupComponent,
//   PitchComponent,
//   SurveyComponent,
//   TargetingComponent
