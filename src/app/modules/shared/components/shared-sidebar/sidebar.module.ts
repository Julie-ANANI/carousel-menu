// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { CollaboratorComponent } from './components/collaborator/collaborator.component';
import { ProfessionalComponent } from './components/professional/professional.component';
import { SidebarComponent } from './sidebar.component';
import { SidebarBatchComponent } from './components/sidebar-batch/sidebar-batch.component';
import { InnovationPreviewComponent } from './components/innovation-preview/innovation-preview.component';
import { UserFormComponent } from './components/user-form/user-form.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    SidebarBatchComponent,
    CollaboratorComponent,
    ProfessionalComponent,
    SidebarComponent,
    InnovationPreviewComponent,
    UserFormComponent
  ],
  exports: [
    CollaboratorComponent,
    ProfessionalComponent,
    SidebarComponent,
    SidebarBatchComponent,
    InnovationPreviewComponent,
    UserFormComponent
  ]
})

export class SidebarModule { }
