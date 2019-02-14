import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AdminCountryManagementComponent } from './admin-country-management.component';

import { SidebarModule } from '../../../../../sidebar/sidebar.module';
import { TableModule} from '../../../../../table/table.module';
import { SidebarEmailFormModule } from '../../../../../sidebar/components/emails-form/sidebar-email-form.module';

@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    TableModule,
    TranslateModule,
    SidebarEmailFormModule
  ],
  declarations: [
    AdminCountryManagementComponent
  ],
  exports: [
    AdminCountryManagementComponent
  ]
})

export class AdminCountryManagementModule {}
