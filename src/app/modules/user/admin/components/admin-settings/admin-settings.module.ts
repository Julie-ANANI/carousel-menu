import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSettingsRoutingModule } from './admin-settings-routing.module';

import { AdminSettingsComponent } from './admin-settings.component';
import { AdminEnterpriseManagementComponent } from './admin-enterprise-management/admin-enterprise-management.component';
import { AdminCountryManagementComponent } from './admin-country-management/admin-country-management.component';
import { AdminEmailBlacklistComponent } from './admin-email-blacklist/admin-email-blacklist.component';

import { SidebarBlacklistModule } from '../../../../sidebars/components/sidebar-blacklist/sidebar-blacklist.module';
import { MessageErrorModule } from '../../../../utility/messages/message-error/message-error.module';
import { MessageTemplateModule } from '../../../../utility/messages/message-template/message-template.module';
import { SidebarEnterprisesModule } from '../../../../sidebars/components/sidebar-enterprises/sidebar-enterprises.module';
import { AdminEntrepriseBulkEditComponent } from './admin-enterprise-management/admin-entreprise-bulk-edit/admin-entreprise-bulk-edit.component';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { AdminEntrepriseAddParentComponent } from './admin-enterprise-management/admin-entreprise-add-parent/admin-entreprise-add-parent.component';
import { AutoCompleteInputModule } from '../../../../utility/auto-complete-input/auto-complete-input.module';
import { InputListModule } from '../../../../utility/input-list/input-list.module';
import { AdminProductTrackingComponent } from './admin-product-management/admin-product-tracking.component';
import { AdminProductSubscriptionTrackingComponent } from './admin-product-management/admin-product-shared-tracking-table/admin-product-subscription-tracking.component';
import { UseSuperToolsComponent } from './admin-product-management/admin-product-shared-tracking-table/use-super-tools.component';
import { HelpCommunityGrowComponent } from './admin-product-management/admin-product-shared-tracking-table/help-community-grow.component';
import { AdminProductSharedTrackingTableComponent } from './admin-product-management/admin-product-shared-tracking-table/admin-product-shared-tracking-table.component';
import { SharedDateSelectorModule } from '../../../../shared/components/shared-date-selector/shared-date-selector.module';
import {AutoSuggestionModule, ModalModule, SidebarFullModule, TableModule} from '@umius/umi-common-component';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarBlacklistModule,
    RouterModule,
    MessageErrorModule,
    MessageTemplateModule,
    SidebarEnterprisesModule,
    ReactiveFormsModule,
    AdminSettingsRoutingModule,
    PipeModule,
    FormsModule,
    AutoCompleteInputModule,
    InputListModule,
    SharedDateSelectorModule,
    TableModule,
    SidebarFullModule,
    ModalModule,
    AutoSuggestionModule,
  ],
  declarations: [
    AdminSettingsComponent,
    AdminEnterpriseManagementComponent,
    AdminCountryManagementComponent,
    AdminEmailBlacklistComponent,
    AdminEntrepriseBulkEditComponent,
    AdminEntrepriseAddParentComponent,
    AdminProductTrackingComponent,
    AdminProductSubscriptionTrackingComponent,
    HelpCommunityGrowComponent,
    UseSuperToolsComponent,
    AdminProductSharedTrackingTableComponent
  ],
  exports: [
    AdminSettingsComponent
  ]
})

export class AdminSettingsModule {
}
