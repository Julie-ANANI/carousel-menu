import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableModule } from '../table/table.module';
import { SharedTagItemModule } from '../shared/components/shared-tag-item/shared-tag-item.module';
import { SharedTextZoneModule } from '../shared/components/shared-text-zone/shared-text-zone.module';
import { PipeModule } from '../../pipe/pipe.module';
import { InputModule } from '../input/input.module';
import { CollaboratorComponent } from './components/collaborator/collaborator.component';
import { SidebarComponent } from './sidebar.component';
import { SidebarBatchComponent } from './components/sidebar-batch/sidebar-batch.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { InnovationPreviewComponent } from './components/innovation-preview/innovation-preview.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { SidebarSearchComponent } from './components/sidebar-search/sidebar-search.component';
import { UserAnswerComponent } from './components/user-answer/user-answer.component';
import { AnswerQuestionComponent } from './components/user-answer/answer-question/answer-question.component';
import { RatingItemComponent } from './components/user-answer/rating-item/rating-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SharedTableModule,
    SharedTagItemModule,
    SharedTextZoneModule,
    PipeModule,
    InputModule
  ],
  declarations: [
    SidebarBatchComponent,
    CollaboratorComponent,
    SidebarComponent,
    InnovationPreviewComponent,
    UserFormComponent,
    SidebarSearchComponent,
    UserAnswerComponent,
    ProjectFormComponent,
    AnswerQuestionComponent,
    RatingItemComponent
  ],
  exports: [
    CollaboratorComponent,
    SidebarComponent,
    SidebarBatchComponent,
    InnovationPreviewComponent,
    UserFormComponent,
    SidebarSearchComponent,
    UserAnswerComponent,
    ProjectFormComponent,
  ]
})

export class SidebarModule {}
