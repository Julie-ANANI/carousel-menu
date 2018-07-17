// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CountryFlagModule } from '../../../../directives/country-flag/country-flag.module';
import { InputListModule } from '../../../../directives/input-list/input-list.module';
import { SharedTableModule } from '../shared-table/table.module';
import { AutocompleteInputModule } from '../../../../directives/autocomplete-input/autocomplete-input.module';
import { SharedTagItemModule } from '../shared-tag-item/shared-tag-item.module';
import { SharedTextZoneModule } from '../shared-text-zone/shared-text-zone.module'
import { PipeModule } from '../../../../pipe/pipe.module';

// Components
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
    CountryFlagModule,
    InputListModule,
    SharedTableModule,
    AutocompleteInputModule,
    SharedTagItemModule,
    SharedTextZoneModule,
    PipeModule
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
