import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarInnovCardPreviewComponent } from './sidebar-innov-card-preview.component';

import { MessageTemplateModule } from '../../../utility/messages/message-template/message-template.module';
import { PipeModule } from '../../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MessageTemplateModule,
    PipeModule
  ],
  declarations: [
    SidebarInnovCardPreviewComponent
  ],
  exports: [
    SidebarInnovCardPreviewComponent
  ]
})

export class SidebarInnovCardPreviewModule {}
