import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AdminBatchesDisplayComponent } from './admin-batches-display.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarInnovCardPreviewModule } from '../../../../sidebars/components/sidebar-innov-card-preview/sidebar-innov-card-preview.module';
import {SidebarFullModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    PipeModule,
    SidebarInnovCardPreviewModule,
    SidebarFullModule
  ],
  declarations: [
    AdminBatchesDisplayComponent
  ],
  exports: [
    AdminBatchesDisplayComponent
  ]
})

export class AdminBatchesDisplayModule {}
