import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {SharedQuestionnaireComponent} from './shared-questionnaire.component';
import { SharedQuestionnaireSectionComponent } from './shared-questionnaire-section/shared-questionnaire-section.component';
import {SharedQuestionnaireQuestionModule} from '../shared-questionnaire-question/shared-questionnaire-question.module';
import {ModalEmptyModule} from '../../../utility/modals/modal-empty/modal-empty.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule,
        FormsModule,
        SharedQuestionnaireQuestionModule,
        ModalEmptyModule
    ],
  declarations: [
    SharedQuestionnaireComponent,
    SharedQuestionnaireSectionComponent
  ],
  exports: [
    SharedQuestionnaireComponent
  ]
})

export class SharedQuestionnaireModule {}
