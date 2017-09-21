import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizRoutingModule } from './quiz-routing.module';
import { QuizComponent } from './quiz.component';
import { QuizFormComponent } from './components/quiz-form/quiz-form.component';
import { SharedModule } from '../shared/shared.module';
import { QuizHeaderComponent } from './components/quiz-header/quiz-header.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    QuizRoutingModule,
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: [
    QuizComponent,
    QuizFormComponent,
    QuizHeaderComponent
  ]
})
export class QuizModule {
}
