import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizComponent } from './quiz.component';
import { QuizFormComponent } from './components/quiz-form/quiz-form.component';

const quizRoutes: Routes = [
  {
    path: '',
    component: QuizComponent,
    children: [
      {
        path: '',
        component: QuizFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(quizRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class QuizRoutingModule {}
