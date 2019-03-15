import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from "../../../../../table/table.module";
import { FormsModule } from "@angular/forms";

import { AdminSignaturesLibraryComponent } from "./admin-signatures-library.component";

import { SidebarModule } from "../../../../../sidebar/sidebar.module";
import { SidebarSignatureModule } from '../../../../../sidebar/components/sidebar-signature/sidebar-signature.module';
import { ModalModule } from '../../../../../utility-components/modal/modal.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    SidebarModule,
    TableModule,
    SidebarSignatureModule,
    ModalModule
  ],
  declarations: [
    AdminSignaturesLibraryComponent
  ],
  exports: [
    AdminSignaturesLibraryComponent
  ]
})

export class AdminSignaturesLibraryModule {}
