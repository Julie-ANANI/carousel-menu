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
import { UserFormComponent } from './components/user-form/user-form.component';
import { SidebarSearchComponent } from './components/sidebar-search/sidebar-search.component';
import { UserAnswerComponent } from './components/user-answer/user-answer.component';
import { AnswerQuestionComponent } from './components/user-answer/answer-question/answer-question.component';
import { RatingItemComponent } from './components/user-answer/rating-item/rating-item.component';
import { SidebarWorkflowComponent } from './components/sidebar-workflow/sidebar-workflow.component';
import { SidebarSignatureComponent } from './components/sidebar-signature/sidebar-signature.component';
import { InnovationFormComponent } from './components/innovation-form/innovation-form.component';
import {SharedProjectEditCardsModule} from '../shared/components/shared-project-edit-cards-component/shared-project-edit-cards.module';
import {SharedProjectSettingsModule} from '../shared/components/shared-project-settings-component/shared-project-settings.module';
import {SharedMailEditorModule} from '../shared/components/shared-mail-editor/shared-mail-editor.module';
import { TagsFormComponent } from './components/tags-form/tags-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    TableModule,
    SharedTagItemModule,
    SharedProjectEditCardsModule,
    SharedProjectSettingsModule,
    SharedMailEditorModule,
    SharedTextZoneModule,
    PipeModule,
    InputModule
  ],
  declarations: [
    SidebarBatchComponent,
    SidebarWorkflowComponent,
    SidebarSignatureComponent,
    CollaboratorComponent,
    SidebarComponent,
    InnovationPreviewComponent,
    UserFormComponent,
    SidebarSearchComponent,
    UserAnswerComponent,
    EmailsFormComponent,
    AnswerQuestionComponent,
    RatingItemComponent,
    InnovationFormComponent,
    TagsFormComponent,
  ],
  exports: [
    CollaboratorComponent,
    SidebarComponent,
    SidebarBatchComponent,
    SidebarWorkflowComponent,
    SidebarSignatureComponent,
    InnovationPreviewComponent,
    UserFormComponent,
    InnovationFormComponent,
    SidebarSearchComponent,
    UserAnswerComponent,
    TagsFormComponent,
    EmailsFormComponent,
  ]
})

export class SidebarModule {}
