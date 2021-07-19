import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';
import {TableModule} from '../../../../../table/table.module';
import {AdminQuestionsLibraryComponent} from './admin-questions-library.component';
import { AdminEditQuestionComponent } from './admin-edit-question/admin-edit-question.component';
import {ModalEmptyModule} from '../../../../../utility/modals/modal-empty/modal-empty.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MessageErrorModule,
    TableModule,
    ModalEmptyModule,
    FormsModule
  ],
  declarations: [
    AdminQuestionsLibraryComponent,
    AdminEditQuestionComponent
  ],
  exports: [
    AdminQuestionsLibraryComponent
  ]
})

export class AdminQuestionsLibraryModule {}
