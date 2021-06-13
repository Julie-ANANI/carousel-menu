import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {SharedQuestionnaireComponent} from './shared-questionnaire.component';
import { SharedQuestionnaireSectionComponent } from './shared-questionnaire-section/shared-questionnaire-section.component';
import { SharedQuestionnaireQuestionComponent } from './shared-questionnaire-question/shared-questionnaire-question.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    FormsModule
  ],
  declarations: [
    SharedQuestionnaireComponent,
    SharedQuestionnaireSectionComponent,
    SharedQuestionnaireQuestionComponent
  ],
  exports: [
    SharedQuestionnaireComponent
  ]
})

export class SharedQuestionnaireModule {}
