import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedAmbassadorListComponent } from './shared-ambassador-list.component';

import { SidebarModule } from '../../../sidebars/templates/sidebar/sidebar.module';
import { SidebarUserFormModule } from '../../../sidebars/components/user-form/sidebar-user-form.module';
import { SidebarTagsModule } from '../../../sidebars/components/sidebar-tags/sidebar-tags.module';
import { ModalModule } from '../../../utility/modals/modal/modal.module';
import { ErrorTemplate1Module } from '../../../utility/errors/error-template-1/error-template-1.module';
import { MessageTemplateModule } from '../../../utility/messages/message-template/message-template.module';
import { TableComponentsModule } from '@umius/umi-common-component/table';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SidebarModule,
        TranslateModule.forChild(),
        SidebarUserFormModule,
        SidebarTagsModule,
        ModalModule,
        ErrorTemplate1Module,
        MessageTemplateModule,
        TableComponentsModule
    ],
  declarations: [
    SharedAmbassadorListComponent
  ],
  exports: [
    SharedAmbassadorListComponent
  ]
})

export class SharedAmbassadorListModule { }
