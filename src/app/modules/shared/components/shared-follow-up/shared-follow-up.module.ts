import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedFollowUpComponent } from './shared-follow-up.component';

import { SidebarLeftModule } from '../../../sidebars/templates/sidebar-left/sidebar-left.module';
import { ModalModule } from "../../../utility-components/modals/modal/modal.module";
import { SharedMailEditorModule } from "../shared-mail-editor/shared-mail-editor.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarLeftModule,
    ModalModule,
    SharedMailEditorModule
  ],
  declarations: [
    SharedFollowUpComponent
  ],
  exports: [
    SharedFollowUpComponent
  ]
})

export class SharedFollowUpModule {}
