import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from "../../../../../table/table.module";
import { FormsModule } from "@angular/forms";

import { AdminSignaturesLibraryComponent } from "./admin-signatures-library.component";

import { SidebarModule } from "../../../../../sidebars/templates/sidebar/sidebar.module";
import { SidebarSignatureModule } from '../../../../../sidebars/components/sidebar-signature/sidebar-signature.module';
import { ModalModule } from '../../../../../utility/modals/modal/modal.module';
import { ErrorTemplate1Module } from '../../../../../utility/errors/error-template-1/error-template-1.module';
import { MessageTemplate2Module } from '../../../../../utility/messages/message-template-2/message-template-2.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    SidebarModule,
    TableModule,
    SidebarSignatureModule,
    ModalModule,
    ErrorTemplate1Module,
    MessageTemplate2Module
  ],
  declarations: [
    AdminSignaturesLibraryComponent
  ],
  exports: [
    AdminSignaturesLibraryComponent
  ]
})

export class AdminSignaturesLibraryModule {}
