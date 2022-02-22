import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { AdminSignaturesLibraryComponent } from './admin-signatures-library.component';

import { SidebarSignatureModule } from '../../../../../sidebars/components/sidebar-signature/sidebar-signature.module';
import { ErrorTemplate1Module } from '../../../../../utility/errors/error-template-1/error-template-1.module';
import { MessageTemplate2Module } from '../../../../../utility/messages/message-template-2/message-template-2.module';
import {ModalModule, SidebarFullModule, TableModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    SidebarSignatureModule,
    ErrorTemplate1Module,
    MessageTemplate2Module,
    TableModule,
    SidebarFullModule,
    ModalModule,
  ],
  declarations: [
    AdminSignaturesLibraryComponent
  ],
  exports: [
    AdminSignaturesLibraryComponent
  ]
})

export class AdminSignaturesLibraryModule {}
