import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { InnovationPreviewComponent } from './innovation-preview.component';

import { SidebarModule } from '../../sidebar.module';
import { MessageTemplate1Module } from '../../../utility-components/messages/message-template-1/message-template-1.module';
import { PipeModule } from '../../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarModule,
    MessageTemplate1Module,
    PipeModule
  ],
  declarations: [
    InnovationPreviewComponent
  ],
  exports: [
    InnovationPreviewComponent
  ]
})

export class SidebarInnovationPreviewModule {}
