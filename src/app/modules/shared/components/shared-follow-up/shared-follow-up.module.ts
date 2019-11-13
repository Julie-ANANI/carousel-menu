import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedFollowUpComponent } from './shared-follow-up.component';

import { SidebarLeftModule } from '../../../sidebars/templates/sidebar-left/sidebar-left.module';
import { ModalModule } from "../../../utility-components/modals/modal/modal.module";
import { SharedMailEditorModule } from "../shared-mail-editor/shared-mail-editor.module";
import { SidebarMarketReportModule } from '../../../sidebars/components/sidebar-market-report/sidebar-market-report.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarLeftModule,
    ModalModule,
    SharedMailEditorModule,
    SidebarMarketReportModule
  ],
  declarations: [
    SharedFollowUpComponent
  ],
  exports: [
    SharedFollowUpComponent
  ]
})

export class SharedFollowUpModule {}
