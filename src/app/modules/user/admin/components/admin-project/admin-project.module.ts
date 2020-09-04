import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import {AdminProjectComponent} from './admin-project.component';

import {MessageErrorModule} from '../../../../utility/messages/message-error/message-error.module';
import {BannerModule} from '../../../../utility/banner/banner.module';
import {ModalModule} from '../../../../utility/modals/modal/modal.module';
import {AdminProjectFollowUpModule} from './admin-project-follow-up/admin-project-follow-up.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    MessageErrorModule,
    BannerModule,
    ModalModule,
    AdminProjectFollowUpModule
  ],
  declarations: [
    AdminProjectComponent
  ],
  exports: [
    AdminProjectComponent
  ]
})

export class AdminProjectModule {}
