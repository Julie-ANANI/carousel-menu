import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminProfessionalsListComponent } from './admin-professionals-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {PipeModule} from '../../../../../../pipe/pipe.module';
import {SharedProfessionalsListModule} from '../../../../../shared/components/shared-professionals-list/shared-professionals-list.module';
import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';



@NgModule({
  declarations: [AdminProfessionalsListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    PipeModule,
    SharedProfessionalsListModule,
    MessageErrorModule,
  ],
  exports: [
    AdminProfessionalsListComponent
  ]
})
export class AdminProfessionalsListModule { }
