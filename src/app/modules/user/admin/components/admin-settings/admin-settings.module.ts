import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {AdminSettingsRoutingModule} from './admin-settings-routing.module';

import {AdminSettingsComponent} from './admin-settings.component';
import {AdminEnterpriseManagementComponent} from './admin-enterprise-management/admin-enterprise-management.component';
import {AdminCountryManagementComponent} from './admin-country-management/admin-country-management.component';
import {AdminEmailBlacklistComponent} from './admin-email-blacklist/admin-email-blacklist.component';

import {SidebarBlacklistModule} from '../../../../sidebars/components/sidebar-blacklist/sidebar-blacklist.module';
import {SidebarModule} from '../../../../sidebars/templates/sidebar/sidebar.module';
import {TableModule} from '../../../../table/table.module';
import {MessageErrorModule} from '../../../../utility/messages/message-error/message-error.module';
import {MessageTemplateModule} from '../../../../utility/messages/message-template/message-template.module';
import {SidebarEnterprisesModule} from '../../../../sidebars/components/sidebar-enterprises/sidebar-enterprises.module';
import {ModalModule} from '../../../../utility/modals/modal/modal.module';
import {AdminEntrepriseBulkEditComponent} from './admin-enterprise-management/admin-entreprise-bulk-edit/admin-entreprise-bulk-edit.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarBlacklistModule,
    RouterModule,
    SidebarModule,
    TableModule,
    MessageErrorModule,
    MessageTemplateModule,
    SidebarEnterprisesModule,
    ReactiveFormsModule,
    ModalModule,
    AdminSettingsRoutingModule
  ],
  declarations: [
    AdminSettingsComponent,
    AdminEnterpriseManagementComponent,
    AdminCountryManagementComponent,
    AdminEmailBlacklistComponent,
    AdminEntrepriseBulkEditComponent
  ],
  exports: [
    AdminSettingsComponent
  ]
})

export class AdminSettingsModule {}
