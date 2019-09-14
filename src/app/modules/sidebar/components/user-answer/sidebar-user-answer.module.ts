import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from '../../sidebar.module';

import { UserAnswerComponent } from './user-answer.component';
import { AnswerQuestionComponent } from './answer-question/answer-question.component';
import { RatingItemComponent } from './rating-item/rating-item.component';

import { CountryFlagModule } from '../../../utility-components/country-flag/country-flag.module';
import { AutoCompleteInputModule } from '../../../utility-components/auto-complete-input/auto-complete-input.module';
import { SharedTagModule } from '../../../shared/components/shared-tag/shared-tag.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { InputListModule } from '../../../utility-components/input-list/input-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    CountryFlagModule,
    AutoCompleteInputModule,
    SharedTagModule,
    PipeModule,
    InputListModule
  ],
  declarations: [
    UserAnswerComponent,
    AnswerQuestionComponent,
    RatingItemComponent
  ],
  exports: [
    UserAnswerComponent
  ]
})

export class SidebarUserAnswerModule {}
