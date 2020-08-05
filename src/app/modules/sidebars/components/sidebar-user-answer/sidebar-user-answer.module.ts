import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from '../../templates/sidebar/sidebar.module';

import { SidebarUserAnswerComponent } from './sidebar-user-answer.component';
import { AnswerQuestionComponent } from './answer-question/answer-question.component';
import { RatingItemComponent } from './rating-item/rating-item.component';

import { CountryFlagModule } from '../../../utility/country-flag/country-flag.module';
import { AutoCompleteInputModule } from '../../../utility/auto-complete-input/auto-complete-input.module';
import { SharedTagsModule } from '../../../shared/components/shared-tags/shared-tags.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { InputListModule } from '../../../utility/input-list/input-list.module';
import { ReassignAnswerComponent } from './reassign-answer/reassign-answer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    CountryFlagModule,
    AutoCompleteInputModule,
    SharedTagsModule,
    PipeModule,
    InputListModule
  ],
  declarations: [
    SidebarUserAnswerComponent,
    AnswerQuestionComponent,
    RatingItemComponent,
    ReassignAnswerComponent
  ],
  exports: [
    SidebarUserAnswerComponent
  ]
})

export class SidebarUserAnswerModule {}
