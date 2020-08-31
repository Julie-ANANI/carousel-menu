import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';

import {AdminSettingsComponent} from './admin-settings.component';
import {AdminEnterpriseManagementComponent} from './admin-enterprise-management/admin-enterprise-management.component';
import {AdminCountryManagementComponent} from './admin-country-management/admin-country-management.component';

import {SidebarBlacklistModule} from '../../../../sidebars/components/sidebar-blacklist/sidebar-blacklist.module';
import {ModalModule} from '../../../../utility/modals/modal/modal.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NguiAutoCompleteModule} from '../../../../utility/auto-complete/auto-complete.module';
import {AutoCompleteInputModule} from '../../../../utility/auto-complete-input/auto-complete-input.module';
import {FileDropModule} from 'ngx-file-drop';
import {SharedUploadZonePhotoModule} from '../../../../shared/components/shared-upload-zone-photo/shared-upload-zone-photo.module';
import {SidebarModule} from '../../../../sidebars/templates/sidebar/sidebar.module';
import {TableModule} from '../../../../table/table.module';
import {MessageErrorModule} from '../../../../utility/messages/message-error/message-error.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarBlacklistModule,
    ModalModule,
    RouterModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    AutoCompleteInputModule,
    FileDropModule,
    SharedUploadZonePhotoModule,
    SidebarModule,
    TableModule,
    MessageErrorModule
  ],
  declarations: [
    AdminSettingsComponent,
    AdminEnterpriseManagementComponent,
    AdminCountryManagementComponent
  ],
  exports: [
    AdminSettingsComponent
  ]
})

export class AdminSettingsModule {}
