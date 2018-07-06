// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { CollaboratorComponent } from './components/collaborator/collaborator.component';
import { ProfessionalComponent } from './components/professional/professional.component';
import { SidebarComponent } from './sidebar.component';
import { SidebarBatchComponent } from './components/sidebar-batch/sidebar-batch.component';
import { InnovationPreviewComponent } from './components/innovation-preview/innovation-preview.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { SidebarSearchComponent } from './components/sidebar-search/sidebar-search.component';
import { CountryFlagModule } from '../../../../directives/country-flag/country-flag.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    CountryFlagModule
  ],
  declarations: [
    SidebarBatchComponent,
    CollaboratorComponent,
    ProfessionalComponent,
    SidebarComponent,
    InnovationPreviewComponent,
    UserFormComponent,
    SidebarSearchComponent,
    UserFormComponent
  ],
  exports: [
    CountryFlagModule,
    CollaboratorComponent,
    ProfessionalComponent,
    SidebarComponent,
    SidebarBatchComponent,
    InnovationPreviewComponent,
    UserFormComponent,
    SidebarSearchComponent
  ]
})

export class SidebarModule { }
