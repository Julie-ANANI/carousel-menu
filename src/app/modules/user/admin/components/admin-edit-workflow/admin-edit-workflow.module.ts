import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AdminEditWorkflowComponent } from './admin-edit-workflow.component';

import { SidebarModule } from '../../../../sidebars/templates/sidebar/sidebar.module';
import { SidebarWorkflowModule } from '../../../../sidebars/components/sidebar-workflow/sidebar-workflow.module';
import { ModalModule } from '../../../../utility/modals/modal/modal.module';
import { TableComponentsModule } from '@umius/umi-common-component/table';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule,

        SidebarModule,
        SidebarWorkflowModule,
        ModalModule,
        TableComponentsModule
    ],
  declarations: [
    AdminEditWorkflowComponent
  ],
  exports: [
    AdminEditWorkflowComponent
  ]
})

export class AdminEditWorkflowModule {}
