// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Services
import { UserFormSidebarService } from './services/user-form-sidebar.service';

// Components
import { UserFormSidebarComponent } from './components/user-form-sidebar/user-form-sidebar.component';
import { UserEditSidebarComponent} from './components/user-edit-sidebar/user-edit-sidebar.component';
import { CollaboratorComponent } from './components/collaborator/collaborator.component';
import { SidebarComponent } from './sidebar.component';
import { SidebarBatchComponent } from './components/sidebar-batch/sidebar-batch.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    UserFormSidebarComponent,
    UserEditSidebarComponent,
    SidebarBatchComponent,
    CollaboratorComponent,
    SidebarComponent
  ],
  providers: [
    UserFormSidebarService,
  ],
  exports: [
    UserFormSidebarComponent,
    UserEditSidebarComponent,
    CollaboratorComponent,
    SidebarComponent,
    SidebarBatchComponent
  ]
})

export class SidebarModule { }
