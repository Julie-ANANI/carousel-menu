// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedRatingItemModule } from '../shared-rating-item/shared-rating-item-module';
import { CountryFlagModule } from '../../../../directives/country-flag/country-flag.module';
import { InputListModule } from '../../../../directives/input-list/input-list.module';
import { AutocompleteInputModule } from '../../../../directives/autocomplete-input/autocomplete-input.module';
import { SharedTagItemModule } from '../shared-tag-item/shared-tag-item.module';

// Components
import { CollaboratorComponent } from './components/collaborator/collaborator.component';
import { SidebarComponent } from './sidebar.component';
import { SidebarBatchComponent } from './components/sidebar-batch/sidebar-batch.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { InnovationPreviewComponent } from './components/innovation-preview/innovation-preview.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { SidebarSearchComponent } from './components/sidebar-search/sidebar-search.component';
import { UserAnswerComponent } from './components/user-answer/user-answer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    CountryFlagModule,
    InputListModule,
    SharedRatingItemModule,
    AutocompleteInputModule,
    SharedTagItemModule
  ],
  declarations: [
    SidebarBatchComponent,
    CollaboratorComponent,
    SidebarComponent,
    InnovationPreviewComponent,
    UserFormComponent,
    SidebarSearchComponent,
    UserAnswerComponent,
    ProjectFormComponent
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

export class SidebarModule { }
