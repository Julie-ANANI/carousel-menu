import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AdminProjectStoryboardComponent } from './admin-project-storyboard.component';

import { AdminExecutiveReportModule } from '../../admin-executive-report/admin-executive-report.module';
import { FormsModule } from '@angular/forms';
import { BannerModule } from '../../../../../utility/banner/banner.module';
import { MessageErrorModule } from "../../../../../utility/messages/message-error/message-error.module";
import {ModalModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    AdminExecutiveReportModule,
    FormsModule,
    BannerModule,
    MessageErrorModule,
    ModalModule
  ],
  declarations: [
    AdminProjectStoryboardComponent
  ],
  exports: [
    AdminProjectStoryboardComponent
  ]
})

export class AdminProjectStoryboardModule { }
