import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-quiz-header',
  templateUrl: './quiz-header.component.html',
  styleUrls: ['./quiz-header.component.scss']
})
export class QuizHeaderComponent implements OnInit {

  constructor(private _translateService: TranslateService) {}

  ngOnInit(): void {
  }

  get translate (): TranslateService {
    return this._translateService;
  }

}
