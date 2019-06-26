import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { InnovationPreviewComponent } from './innovation-preview.component';

import { SidebarModule } from '../../sidebar.module';
import { MessageSpaceModule } from '../../../utility-components/messages/message-template-1/message-space.module';
import { PipeModule } from '../../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarModule,
    MessageSpaceModule,
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
