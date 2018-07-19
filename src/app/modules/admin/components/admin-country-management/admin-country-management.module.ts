import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminCountryManagementComponent } from './admin-country-management.component';
import { SidebarModule } from '../../../sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    TranslateModule
  ],
  declarations: [
    AdminCountryManagementComponent
  ],
  exports: [
    AdminCountryManagementComponent
  ]
})

export class AdminCountryManagementModule {}
