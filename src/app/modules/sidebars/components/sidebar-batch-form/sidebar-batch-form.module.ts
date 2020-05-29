import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarBatchFormComponent } from './sidebar-batch-form.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';
import { SharedTextZoneModule } from '../../../shared/components/shared-text-zone/shared-text-zone.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    SharedTextZoneModule
  ],
  declarations: [
    SidebarBatchFormComponent
  ],
  exports: [
    SidebarBatchFormComponent
  ]
})

export class SidebarBatchFormModule {}
