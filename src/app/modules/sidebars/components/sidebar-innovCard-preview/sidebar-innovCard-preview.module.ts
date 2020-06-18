import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarInnovCardPreviewComponent } from './sidebar-innovCard-preview.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';
import { MessageTemplate1Module } from '../../../utility/messages/message-template-1/message-template-1.module';
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
    SidebarInnovCardPreviewComponent
  ],
  exports: [
    SidebarInnovCardPreviewComponent
  ]
})

export class SidebarInnovCardPreviewModule {}
