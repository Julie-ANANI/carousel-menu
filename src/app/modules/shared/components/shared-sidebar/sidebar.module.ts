// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Services
import { UserFormSidebarService } from './services/user-form-sidebar.service';

// Components
import { UserFormSidebarComponent } from './components/user-form-sidebar/user-form-sidebar.component';
import { UserEditSidebarComponent} from './components/user-edit-sidebar/user-edit-sidebar.component';
import { CollaboratorComponent } from './components/collaborator/collaborator.component';
import { ProfessionalComponent } from './components/professional/professional.component';
import { SidebarComponent } from './sidebar.component';
import { SidebarBatchComponent } from './components/sidebar-batch/sidebar-batch.component';
import { InnovationPreviewComponent } from './components/innovation-preview/innovation-preview.component';
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
    UserFormSidebarComponent,
    UserEditSidebarComponent,
    SidebarBatchComponent,
    CollaboratorComponent,
    ProfessionalComponent,
    SidebarComponent,
    InnovationPreviewComponent,
    SidebarSearchComponent
  ],
  providers: [
    UserFormSidebarService,
  ],
  exports: [
    CountryFlagModule,
    UserFormSidebarComponent,
    UserEditSidebarComponent,
    CollaboratorComponent,
    ProfessionalComponent,
    SidebarComponent,
    SidebarBatchComponent,
    InnovationPreviewComponent,
    SidebarSearchComponent
  ]
})

export class SidebarModule { }
