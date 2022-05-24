import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AdminUseCasesLibraryComponent } from './admin-use-cases-library.component';
import { MessageErrorModule } from '../../../../../utility/messages/message-error/message-error.module';
import { AdminEditUseCaseComponent } from './admin-edit-use-case/admin-edit-use-case.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedQuestionnaireModule } from '../../../../../shared/components/shared-questionnaire/shared-questionnaire.module';
import {ModalModule, TableModule} from '@umius/umi-common-component';
import { SharedQuestionnaireMirrorViewModule } from "../../../../../shared/components/shared-questionnaire-mirror-view/shared-questionnaire-mirror-view.module";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        MessageErrorModule,
        ReactiveFormsModule,
        FormsModule,
        SharedQuestionnaireModule,
        TableModule,
        ModalModule,
        SharedQuestionnaireMirrorViewModule,
    ],
  declarations: [
    AdminUseCasesLibraryComponent,
    AdminEditUseCaseComponent,
  ],
  exports: [
    AdminUseCasesLibraryComponent
  ]
})

export class AdminUseCasesLibraryModule {
}
