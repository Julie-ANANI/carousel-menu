import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';
import {TableModule} from '../../../../../table/table.module';
import {AdminQuestionsLibraryComponent} from './admin-questions-library.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MessageErrorModule,
    TableModule
  ],
  declarations: [
    AdminQuestionsLibraryComponent
  ],
  exports: [
    AdminQuestionsLibraryComponent
  ]
})

export class AdminQuestionsLibraryModule {}
