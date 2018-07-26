import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminEmailsLibraryComponent } from "./admin-emails-library.component";
import { SidebarModule } from "../../../../sidebar/sidebar.module";
import { TableModule } from "../../../../table/table.module";
import { FormsModule } from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    SidebarModule,
    TableModule
  ],
  declarations: [
    AdminEmailsLibraryComponent
  ],
  exports: [
    AdminEmailsLibraryComponent
  ]
})

export class AdminEmailsLibraryModule {}
