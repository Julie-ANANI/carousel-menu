import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarSignatureComponent } from './sidebar-signature.component';

import { SidebarModule } from '../../sidebar.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
  ],
  declarations: [
    SidebarSignatureComponent
  ],
  exports: [
    SidebarSignatureComponent
  ]
})

export class SidebarSignatureModule {}
