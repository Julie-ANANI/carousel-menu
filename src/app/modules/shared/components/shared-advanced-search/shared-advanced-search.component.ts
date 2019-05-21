import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnswerService } from "../../../../services/answer/answer.service";

@Component({
  selector: 'app-shared-advanced-search',
  templateUrl: './shared-advanced-search.component.html',
  styleUrls: ['./shared-advanced-search.component.scss']
})

export class SharedAdvancedSearchComponent {

  private _config: any = {
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  @Input() set config(value: any) {
    this._config = value;
    this.loadAnswers();
  }

  @Output() modalAnswerChange = new EventEmitter<any>();


  constructor( private _answerService: AnswerService ) { }

  loadAnswers() {

    this._answerService.getAll(this._config).subscribe((answers: any) => {

    }, err=>{
      console.error(err);
    });
  }

}
