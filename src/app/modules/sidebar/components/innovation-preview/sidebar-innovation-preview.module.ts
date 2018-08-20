import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from '../../sidebar.module';
import { InnovationPreviewComponent } from './innovation-preview.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarModule
  ],
  declarations: [
    InnovationPreviewComponent
  ],
  exports: [
    InnovationPreviewComponent
  ]
})

export class SidebarInnovationPreviewModule {}
