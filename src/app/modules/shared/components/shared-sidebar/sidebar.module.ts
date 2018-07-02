// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClientDiscoverDescriptionModule } from '../../../client/components/client-discover-description/client-discover-description.module';

// Services
import { UserFormSidebarService } from './services/user-form-sidebar.service';
import { InnovationPreviewSidebarService } from './services/innovation-preview-sidebar.service';

// Components
import { UserFormSidebarComponent } from './components/user-form-sidebar/user-form-sidebar.component';
import { InnovationPreviewSidebarComponent } from './components/innovation-preview-sidebar/innovation-preview-sidebar.component';
import { GenericSidebarComponent } from './components/generic-sidebar/generic-sidebar.component';
import { UserEditSidebarComponent} from './components/user-edit-sidebar/user-edit-sidebar.component';
import { ConfirmationSidebarComponent } from './components/confirmation-sidebar/confirmation-sidebar.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    ClientDiscoverDescriptionModule
  ],
  declarations: [
    UserFormSidebarComponent,
    InnovationPreviewSidebarComponent,
    GenericSidebarComponent,
    UserEditSidebarComponent,
    GenericSidebarComponent,
    ConfirmationSidebarComponent
  ],
  providers: [
    UserFormSidebarService,
    InnovationPreviewSidebarService
  ],
  exports: [
    UserFormSidebarComponent,
    InnovationPreviewSidebarComponent,
    GenericSidebarComponent,
    ConfirmationSidebarComponent,
    GenericSidebarComponent,
    UserEditSidebarComponent
  ]
})

export class SidebarModule { }
