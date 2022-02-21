import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProsListModule } from '../../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { PipeModule } from '../../../../../../pipe/pipe.module';
import { AdminCommunityResponsesComponent } from "./admin-community-responses.component";
import { SharedAnswerListModule } from "../../../../../shared/components/shared-answers-list/shared-answer-list.module";
import { SidebarUserAnswerModule } from "../../../../../sidebars/components/sidebar-user-answer/sidebar-user-answer.module";


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    PipeModule,
    SidebarUserAnswerModule,
    SharedAnswerListModule
  ],
  declarations: [
    AdminCommunityResponsesComponent
  ],
  exports: [
    AdminCommunityResponsesComponent
  ]
})

export class AdminCommunityResponsesModule { }
