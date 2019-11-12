import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from '../../../../table/table.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarModule } from '../../../../sidebars/templates/sidebar/sidebar.module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminMissionsListModule } from '../admin-missions-list/admin-missions-list.module';
import { SidebarInnovationPreviewModule } from '../../../../sidebars/components/innovation-preview/sidebar-innovation-preview.module';
import { SharedLoaderModule } from '../../../../shared/components/shared-loader/shared-loader.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    SidebarInnovationPreviewModule,
    TableModule,
    TranslateModule.forChild(),
    PipeModule,
    AdminMissionsListModule,
    FormsModule,
    SharedLoaderModule
  ],
  declarations: [
    AdminDashboardComponent
  ],
  exports: [
    AdminDashboardComponent
  ]
})

export class AdminDashboardModule { }
