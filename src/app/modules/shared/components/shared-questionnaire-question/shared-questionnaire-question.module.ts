import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {SharedQuestionnaireQuestionComponent} from './shared-questionnaire-question.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule
  ],
  declarations: [
    SharedQuestionnaireQuestionComponent
  ],
  exports: [
    SharedQuestionnaireQuestionComponent
  ]
})

export class SharedQuestionnaireQuestionModule {}
