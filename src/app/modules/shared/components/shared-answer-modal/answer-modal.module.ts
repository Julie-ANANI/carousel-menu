import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { AnswerModalComponent } from './answer-modal.component';
import { AnswerQuestionComponent } from './components/answer-question/answer-question.component';
import { RatingItemComponent } from './components/rating-item/rating-item.component';
import { MultilingPipe } from '../../../../pipes/multiling.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AnswerModalComponent,
    AnswerQuestionComponent,
    RatingItemComponent,
    MultilingPipe
  ],
  exports: [
    AnswerModalComponent
  ]
})

export class SharedAnswerModalModule {}
