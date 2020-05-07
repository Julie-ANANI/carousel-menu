import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AdminEditWorkflowComponent } from './admin-edit-workflow.component';

import { TableModule } from '../../../../table/table.module';
import { SidebarModule } from '../../../../sidebars/templates/sidebar/sidebar.module';
import { SidebarWorkflowFormModule } from '../../../../sidebars/components/workflow-form/sidebar-workflow-form.module';
import { ModalModule } from '../../../../utility/modals/modal/modal.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    TableModule,
    SidebarModule,
    SidebarWorkflowFormModule,
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
