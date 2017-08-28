import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz',
  template: '<app-quiz-header></app-quiz-header><router-outlet></router-outlet>'
})
export class QuizComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
