import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SidebarEnterprisesComponent } from './sidebar-enterprises.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule
  ],
  declarations: [
    SidebarEnterprisesComponent
  ],
  exports: [
    SidebarEnterprisesComponent
  ]
})

export class SidebarEnterprisesModule {}
