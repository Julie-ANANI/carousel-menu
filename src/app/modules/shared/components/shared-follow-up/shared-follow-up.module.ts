import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedFollowUpComponent } from './shared-follow-up.component';

import { SharedMailEditorModule } from '../shared-mail-editor/shared-mail-editor.module';
import { SidebarFilterAnswersModule } from '../../../sidebars/components/sidebar-filter-answers/sidebar-filter-answers.module';
import { SidebarUserAnswerModule } from '../../../sidebars/components/sidebar-user-answer/sidebar-user-answer.module';
import { SharedFollowUpClientComponent } from './shared-follow-up-client/shared-follow-up-client.component';
import { SharedFollowUpAdminComponent } from './shared-follow-up-admin/shared-follow-up-admin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedWorldmapModule} from '../shared-worldmap/shared-worldmap.module';
import {LangEntryPipeModule} from '../../../../pipe/lang-entry/langEntryPipe.module';
import {ModalModule, SidebarFullModule, SidebarInlineModule, TableModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SharedMailEditorModule,
    SidebarFilterAnswersModule,
    SidebarUserAnswerModule,
    FormsModule,
    ReactiveFormsModule,
    SharedWorldmapModule,
    LangEntryPipeModule,
    TableModule,
    SidebarInlineModule,
    SidebarFullModule,
    ModalModule
  ],
  declarations: [
    SharedFollowUpComponent,
    SharedFollowUpClientComponent,
    SharedFollowUpAdminComponent
  ],
  exports: [
    SharedFollowUpComponent
  ]
})

export class SharedFollowUpModule {}
