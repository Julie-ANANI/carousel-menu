import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedFollowUpComponent } from './shared-follow-up.component';

import { SidebarLeftModule } from '../../../sidebars/templates/sidebar-left/sidebar-left.module';
import { ModalModule } from "../../../utility-components/modals/modal/modal.module";
import { SharedMailEditorModule } from "../shared-mail-editor/shared-mail-editor.module";
import { SidebarFilterAnswersModule } from '../../../sidebars/components/sidebar-filter-answers/sidebar-filter-answers.module';
import { TableModule } from '../../../table/table.module';
import { SidebarModule } from "../../../sidebars/templates/sidebar/sidebar.module";
import { SidebarUserAnswerModule } from "../../../sidebars/components/user-answer/sidebar-user-answer.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarLeftModule,
    ModalModule,
    SharedMailEditorModule,
    SidebarFilterAnswersModule,
    TableModule,
    SidebarModule,
    SidebarUserAnswerModule
  ],
  declarations: [
    SharedFollowUpComponent
  ],
  exports: [
    SharedFollowUpComponent
  ]
})

export class SharedFollowUpModule {}
