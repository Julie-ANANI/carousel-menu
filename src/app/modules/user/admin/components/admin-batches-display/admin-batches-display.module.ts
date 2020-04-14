import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AdminBatchesDisplayComponent } from './admin-batches-display.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarModule } from '../../../../sidebars/templates/sidebar/sidebar.module';
import { SidebarInnovationPreviewModule } from '../../../../sidebars/components/sidebar-innovation-preview/sidebar-innovation-preview.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    PipeModule,
    SidebarModule,
    SidebarInnovationPreviewModule
  ],
  declarations: [
    AdminBatchesDisplayComponent
  ],
  exports: [
    AdminBatchesDisplayComponent
  ]
})

export class AdminBatchesDisplayModule {}
