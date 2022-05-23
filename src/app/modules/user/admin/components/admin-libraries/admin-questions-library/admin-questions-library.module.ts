import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';
import {AdminQuestionsLibraryComponent} from './admin-questions-library.component';
import { AdminEditQuestionComponent } from './admin-edit-question/admin-edit-question.component';
import {FormsModule} from '@angular/forms';
import {TextareaAutoResizeModule} from '../../../../../../directives/textareaAutoResize/textarea-auto-resize.module';
import {ModalModule, TableModule} from '@umius/umi-common-component';
import { SharedQuestionnaireMirrorViewModule } from "../../../../../shared/components/shared-questionnaire-mirror-view/shared-questionnaire-mirror-view.module";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        MessageErrorModule,
        FormsModule,
        TextareaAutoResizeModule,
        ModalModule,
        TableModule,
        SharedQuestionnaireMirrorViewModule
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
