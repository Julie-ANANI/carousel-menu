import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminWorkflowsLibraryComponent } from "./admin-workflows-library.component";
import { RouterModule } from "@angular/router";


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule
  ],
  declarations: [
    AdminWorkflowsLibraryComponent
  ],
  exports: [
    AdminWorkflowsLibraryComponent
  ]
})

export class AdminWorkflowsLibraryModule {}
