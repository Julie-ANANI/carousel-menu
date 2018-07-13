// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTextZoneModule } from '../shared-text-zone/shared-text-zone.module'

// Components
import { CollaboratorComponent } from './components/collaborator/collaborator.component';
import { SidebarComponent } from './sidebar.component';
import { SidebarBatchComponent } from './components/sidebar-batch/sidebar-batch.component';
import { InnovationPreviewComponent } from './components/innovation-preview/innovation-preview.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { SidebarSearchComponent } from './components/sidebar-search/sidebar-search.component';
import { CountryFlagModule } from '../../../../directives/country-flag/country-flag.module';
import { GlobalModule } from "../../../global/global.module";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    CountryFlagModule,
    SharedTextZoneModule,
    GlobalModule
  ],
  declarations: [
    SidebarBatchComponent,
    CollaboratorComponent,
    SidebarComponent,
    InnovationPreviewComponent,
    UserFormComponent,
    InnovationPreviewComponent,
    SidebarSearchComponent
  ],
  exports: [
    CountryFlagModule,
    SharedTextZoneModule,
    CollaboratorComponent,
    SidebarComponent,
    SidebarBatchComponent,
    InnovationPreviewComponent,
    UserFormComponent,
    InnovationPreviewComponent,
    SidebarSearchComponent
  ]
})

export class SidebarModule {}
