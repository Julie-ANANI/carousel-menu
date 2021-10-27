import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';
import {AdminQuestionsLibraryComponent} from './admin-questions-library.component';
import { AdminEditQuestionComponent } from './admin-edit-question/admin-edit-question.component';
import {ModalEmptyModule} from '../../../../../utility/modals/modal-empty/modal-empty.module';
import {FormsModule} from '@angular/forms';
import { TableComponentsModule } from '@umius/umi-common-component/table';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        MessageErrorModule,

        ModalEmptyModule,
        FormsModule,
        TableComponentsModule
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
