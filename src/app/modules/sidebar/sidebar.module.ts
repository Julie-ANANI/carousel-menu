import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from '../table/table.module';
import { SharedTagItemModule } from '../shared/components/shared-tag-item/shared-tag-item.module';
import { SharedTextZoneModule } from '../shared/components/shared-text-zone/shared-text-zone.module';
import { PipeModule } from '../../pipe/pipe.module';
import { InputModule } from '../input/input.module';
import { CollaboratorComponent } from './components/collaborator/collaborator.component';
import { SidebarComponent } from './sidebar.component';
import { SidebarBatchComponent } from './components/sidebar-batch/sidebar-batch.component';
import { EmailsFormComponent } from './components/emails-form/emails-form.component';
import { InnovationPreviewComponent } from './components/innovation-preview/innovation-preview.component';
import { SidebarSearchComponent } from './components/sidebar-search/sidebar-search.component';
import { UserAnswerComponent } from './components/user-answer/user-answer.component';
import { AnswerQuestionComponent } from './components/user-answer/answer-question/answer-question.component';
import { RatingItemComponent } from './components/user-answer/rating-item/rating-item.component';
import { SidebarWorkflowComponent } from './components/sidebar-workflow/sidebar-workflow.component';
import { SidebarSignatureComponent } from './components/sidebar-signature/sidebar-signature.component';
import { AutocompleteInputModule } from '../input/component/autocomplete-input/autocomplete-input.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    TableModule,
    SharedTagItemModule,
    SharedTextZoneModule,
    PipeModule,
    InputModule,
    AutocompleteInputModule,
  ],
  declarations: [
    SidebarBatchComponent,
    SidebarWorkflowComponent,
    SidebarSignatureComponent,
    CollaboratorComponent,
    SidebarComponent,
    InnovationPreviewComponent,
    SidebarSearchComponent,
    UserAnswerComponent,
    EmailsFormComponent,
    AnswerQuestionComponent,
    RatingItemComponent
  ],
  exports: [
    CollaboratorComponent,
    SidebarComponent,
    SidebarBatchComponent,
    SidebarWorkflowComponent,
    SidebarSignatureComponent,
    InnovationPreviewComponent,
    SidebarSearchComponent,
    UserAnswerComponent,
    EmailsFormComponent,
  ]
})

export class SidebarModule {}
