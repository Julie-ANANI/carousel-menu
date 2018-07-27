import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import {AdminProjectQuestionnaireQuestionComponent} from './admin-project-questionnaire-question/admin-project-questionnaire-question.component';
import {AdminProjectQuestionnaireComponent} from './admin-project-questionnaire.component';
import {AdminProjectQuestionnaireSectionComponent} from './admin-project-questionnaire-section/admin-project-questionnaire-section.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdminProjectQuestionnaireQuestionComponent,
    AdminProjectQuestionnaireComponent,
    AdminProjectQuestionnaireSectionComponent
  ],
  exports: [
    AdminProjectQuestionnaireQuestionComponent,
    AdminProjectQuestionnaireSectionComponent
  ]
})

export class AdminProjectQuestionnaireModule {}
