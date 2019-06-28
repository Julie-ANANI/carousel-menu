import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AdminLibrariesComponent } from './admin-libraries.component';
import { AdminEmailBlacklistComponent } from '../admin-settings/admin-email-blacklist/admin-email-blacklist.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { SharedSortModule } from '../../../../shared/components/shared-sort/shared-sort.module';
import { AdminWorkflowsLibraryModule } from './admin-workflows-library/admin-workflows-library.module';
import { AdminSignaturesLibraryModule } from './admin-signatures-library/admin-signatures-library.module';
import { AdminCountryManagementModule } from '../admin-settings/admin-country-management/admin-country-management.module';
import { AdminEmailsLibraryModule } from './admin-emails-library/admin-emails-library.module';
import { AdminPresetsModule } from './admin-presets/admin-presets.module';
import { TableModule } from '../../../../table/table.module';
import { SidebarModule } from '../../../../sidebar/sidebar.module';
import { SidebarEmailFormModule } from '../../../../sidebar/components/emails-form/sidebar-email-form.module';
import { ModalModule } from '../../../../utility-components/modals/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    SharedSortModule,
    RouterModule,
    TranslateModule.forChild(),
    PipeModule,
    AdminWorkflowsLibraryModule,
    AdminSignaturesLibraryModule,
    AdminEmailsLibraryModule,
    AdminPresetsModule,
    AdminCountryManagementModule,
    TableModule,
    SidebarModule,
    SidebarEmailFormModule,
    ModalModule,
  ],
  declarations: [
    AdminLibrariesComponent,
    AdminEmailBlacklistComponent
  ],
  exports: [
    AdminLibrariesComponent
  ]
})

export class AdminLibrariesModule {}
