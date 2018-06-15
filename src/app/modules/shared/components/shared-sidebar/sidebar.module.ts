// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClientDiscoverDescriptionModule } from '../../../client/components/client-discover-description/client-discover-description.module';

// Components
import { UserFormSidebarComponent } from './components/user-form-sidebar/user-form-sidebar.component';
import { InnovationPreviewSidebarComponent } from './components/innovation-preview/innovation-preview-sidebar.component';

// Services
import { UserFormSidebarService } from './services/user-form-sidebar.service';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    ClientDiscoverDescriptionModule
  ],
  declarations: [
    UserFormSidebarComponent,
    InnovationPreviewSidebarComponent
  ],
  providers: [
    UserFormSidebarService
  ],
  exports: [
    UserFormSidebarComponent,
    InnovationPreviewSidebarComponent
  ]
})

export class SidebarModule { }
