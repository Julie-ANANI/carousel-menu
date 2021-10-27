import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedFollowUpComponent } from './shared-follow-up.component';

import { SidebarLeftModule } from '../../../sidebars/templates/sidebar-left/sidebar-left.module';
import { ModalModule } from '../../../utility/modals/modal/modal.module';
import { SharedMailEditorModule } from '../shared-mail-editor/shared-mail-editor.module';
import { SidebarFilterAnswersModule } from '../../../sidebars/components/sidebar-filter-answers/sidebar-filter-answers.module';
import { SidebarModule } from '../../../sidebars/templates/sidebar/sidebar.module';
import { SidebarUserAnswerModule } from '../../../sidebars/components/sidebar-user-answer/sidebar-user-answer.module';
import {SidebarInPageModule} from '../../../sidebars/templates/sidebar-in-page/sidebar-in-page.module';
import { SharedFollowUpClientComponent } from './shared-follow-up-client/shared-follow-up-client.component';
import { SharedFollowUpAdminComponent } from './shared-follow-up-admin/shared-follow-up-admin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalEmptyModule} from '../../../utility/modals/modal-empty/modal-empty.module';
import { TableComponentsModule } from '@umius/umi-common-component/table';
import {SharedWorldmapModule} from '../shared-worldmap/shared-worldmap.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarLeftModule,
    ModalModule,
    SharedMailEditorModule,
    SidebarFilterAnswersModule,
    SidebarModule,
    SidebarUserAnswerModule,
    SidebarInPageModule,
    FormsModule,
    ModalEmptyModule,
    ReactiveFormsModule,
    SharedWorldmapModule,
    TableComponentsModule
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
