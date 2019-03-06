import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { BatchFormComponent } from './batch-form.component';

import { SidebarModule } from '../../sidebar.module';
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
    BatchFormComponent
  ],
  exports: [
    BatchFormComponent
  ]
})

export class SidebarBatchFormModule {}
