import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminProfessionalsComponent } from './admin-professionals.component';

import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { SharedProfessionalsListModule } from '../../../../shared/components/shared-professionals-list/shared-professionals-list.module';
import { MessageErrorModule } from "../../../../utility/messages/message-error/message-error.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    PipeModule,
    SharedProfessionalsListModule,
    MessageErrorModule
  ],
  declarations: [
    AdminProfessionalsComponent
  ],
  exports: [
    AdminProfessionalsComponent
  ]
})

export class AdminProfessionalsModule { }
