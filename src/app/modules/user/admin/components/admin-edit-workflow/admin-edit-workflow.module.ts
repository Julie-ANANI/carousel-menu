import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AdminEditWorkflowComponent } from './admin-edit-workflow.component';

import { TableModule } from '../../../../table/table.module';
import { SidebarModule } from '../../../../sidebar/sidebar.module';
import { SidebarWorkflowModule } from '../../../../sidebar/components/sidebar-workflow/sidebar-workflow.module';
import { ModalModule } from '../../../../utility-components/modal/modal.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    TableModule,
    SidebarModule,
    SidebarWorkflowModule,
    ModalModule
  ],
  declarations: [
    AdminEditWorkflowComponent
  ],
  exports: [
    AdminEditWorkflowComponent
  ]
})

export class AdminEditWorkflowModule {}
