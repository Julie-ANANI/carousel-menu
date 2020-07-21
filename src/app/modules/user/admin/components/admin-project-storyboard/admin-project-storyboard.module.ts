import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AdminProjectStoryboardComponent } from './admin-project-storyboard.component';

import { ModalModule } from '../../../../utility/modals/modal/modal.module';
import { AdminExecutiveReportModule } from '../admin-executive-report/admin-executive-report.module';
import { FormsModule } from '@angular/forms';
import { ModalEmptyModule } from '../../../../utility/modals/modal-empty/modal-empty.module';
import { BannerModule } from '../../../../utility/banner/banner.module';
import { MessageErrorModule } from "../../../../utility/messages/message-error/message-error.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ModalModule,
    RouterModule,
    AdminExecutiveReportModule,
    FormsModule,
    ModalEmptyModule,
    BannerModule,
    MessageErrorModule
  ],
  declarations: [
    AdminProjectStoryboardComponent
  ],
  exports: [
    AdminProjectStoryboardComponent
  ]
})

export class AdminProjectStoryboardModule { }
