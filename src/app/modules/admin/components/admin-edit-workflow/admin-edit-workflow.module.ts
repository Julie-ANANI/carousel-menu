import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from "@angular/router";
import { AdminEditWorkflowComponent } from "./admin-edit-workflow.component";
import { SharedTableModule } from "../../../table/table.module";
import { SidebarModule } from "../../../sidebar/sidebar.module";


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    SharedTableModule,
    SidebarModule
  ],
  declarations: [
    AdminEditWorkflowComponent
  ],
  exports: [
    AdminEditWorkflowComponent
  ]
})

export class AdminEditWorkflowModule {}
