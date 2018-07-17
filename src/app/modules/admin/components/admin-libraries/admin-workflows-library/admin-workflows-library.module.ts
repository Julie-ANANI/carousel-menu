import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminWorkflowsLibraryComponent } from "./admin-workflows-library.component";
import { AdminEditWorkflowModule } from "../../admin-edit-workflow/admin-edit-workflow.module";
import { FormsModule } from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    AdminEditWorkflowModule,
    FormsModule
  ],
  declarations: [
    AdminWorkflowsLibraryComponent
  ],
  exports: [
    AdminWorkflowsLibraryComponent
  ]
})

export class AdminWorkflowsLibraryModule {}
