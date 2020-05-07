import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AdminEnterpriseManagementComponent } from './admin-enterprise-management.component';

import { SidebarModule } from '../../../../../sidebars/templates/sidebar/sidebar.module';
import { TableModule} from '../../../../../table/table.module';
import { SidebarEmailFormModule } from '../../../../../sidebars/components/emails-form/sidebar-email-form.module';
import { ModalModule } from '../../../../../utility/modals/modal/modal.module';
import {ReactiveFormsModule} from "@angular/forms";
import {NguiAutoCompleteModule} from "../../../../../utility/auto-complete/auto-complete.module";
import {AutoCompleteInputModule} from "../../../../../utility/auto-complete-input/auto-complete-input.module";
import {FileDropModule} from "ngx-file-drop";
import {SharedUploadZonePhotoModule} from "../../../../../shared/components/shared-upload-zone-photo/shared-upload-zone-photo.module";

@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    TableModule,
    TranslateModule.forChild(),
    SidebarEmailFormModule,
    ModalModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    AutoCompleteInputModule,
    ModalModule,
    FileDropModule,
    SharedUploadZonePhotoModule
  ],
  declarations: [
    AdminEnterpriseManagementComponent
  ],
  exports: [
    AdminEnterpriseManagementComponent
  ]
})

export class AdminEnterpriseManagementModule {}
