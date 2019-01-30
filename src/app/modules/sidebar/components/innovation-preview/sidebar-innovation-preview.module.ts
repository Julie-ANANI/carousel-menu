import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { InnovationPreviewComponent } from './innovation-preview.component';

import { SidebarModule } from '../../sidebar.module';
import { MessageSpaceModule } from '../../../utility-components/message-space/message-space.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarModule,
    MessageSpaceModule
  ],
  declarations: [
    InnovationPreviewComponent
  ],
  exports: [
    InnovationPreviewComponent
  ]
})

export class SidebarInnovationPreviewModule {}
