import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from '../../../table/table.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { InputModule } from '../../../input/input.module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import {AdminProjectsListModule} from '../admin-projects-list/admin-projects-list.module';
import {SidebarInnovationPreviewModule} from '../../../sidebar/components/innovation-preview/sidebar-innovation-preview.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    SidebarInnovationPreviewModule,
    TableModule,
    TranslateModule.forChild(),
    PipeModule,
    InputModule,
    AdminProjectsListModule,
    FormsModule,
  ],
  declarations: [
    AdminDashboardComponent
  ],
  exports: [
    AdminDashboardComponent
  ]
})

export class AdminDashboardModule { }
