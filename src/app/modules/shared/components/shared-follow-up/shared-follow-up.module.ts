import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';
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
import { SharedFollowUpAdminEditorComponent } from './shared-follow-up-admin/shared-follow-up-admin-editor/shared-follow-up-admin-editor/shared-follow-up-admin-editor.component';
import {SharedEditorTinymceModule} from '../shared-editor-tinymce/shared-editor-tinymce.module';

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
    ModalModule,
    SharedEditorTinymceModule
  ],
  declarations: [
    SharedFollowUpComponent,
    SharedFollowUpClientComponent,
    SharedFollowUpAdminComponent,
    SharedFollowUpAdminEditorComponent
  ],
  exports: [
    SharedFollowUpComponent
  ],
  providers: [
    TitleCasePipe
  ]
})

export class SharedFollowUpModule {}
