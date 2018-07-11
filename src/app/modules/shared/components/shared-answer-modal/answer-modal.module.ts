import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { AnswerModalComponent } from './answer-modal.component';
import { AnswerQuestionComponent } from './components/answer-question/answer-question.component';
import { RatingItemComponent } from './components/rating-item/rating-item.component';
import { MultilingModule } from '../../../../pipes/multiling/multiling.module';
import { GlobalModule } from "../../../global/global.module";

@NgModule({
  imports: [
    CommonModule,
    MultilingModule,
    SharedModule,
    TranslateModule.forChild(),
    GlobalModule
  ],
  declarations: [
    AnswerModalComponent,
    AnswerQuestionComponent,
    RatingItemComponent
  ],
  exports: [
    AnswerModalComponent
  ]
})

export class SharedAnswerModalModule {}
