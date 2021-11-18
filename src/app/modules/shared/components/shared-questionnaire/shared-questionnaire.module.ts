import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {SharedQuestionnaireComponent} from './shared-questionnaire.component';
import { SharedQuestionnaireSectionComponent } from './shared-questionnaire-section/shared-questionnaire-section.component';
import {ModalEmptyModule} from '../../../utility/modals/modal-empty/modal-empty.module';
import {SharedQuestionnaireQuestionComponent} from './shared-questionnaire-question/shared-questionnaire-question.component';
import {AutoSuggestionModule} from '../../../utility/auto-suggestion/auto-suggestion.module';
import { SharedQuestionnaireQuestionLikertComponent } from './shared-questionnaire-question-likert/shared-questionnaire-question-likert.component';
import {TextareaAutoResizeModule} from '../../../../directives/textareaAutoResize/textarea-auto-resize.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule,
        FormsModule,
        ModalEmptyModule,
        AutoSuggestionModule,
        TextareaAutoResizeModule
    ],
  declarations: [
    SharedQuestionnaireComponent,
    SharedQuestionnaireSectionComponent,
    SharedQuestionnaireQuestionComponent,
    SharedQuestionnaireQuestionLikertComponent,
  ],
  exports: [
    SharedQuestionnaireComponent
  ]
})

export class SharedQuestionnaireModule {}
