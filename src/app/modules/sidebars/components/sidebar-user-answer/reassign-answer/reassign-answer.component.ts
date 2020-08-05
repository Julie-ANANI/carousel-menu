import {Component, EventEmitter, Output} from '@angular/core';

export interface NewPro {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  company: string;
  country: string;
}

@Component({
  selector: 'app-reassign-answer',
  templateUrl: './reassign-answer.component.html',
  styleUrls: ['./reassign-answer.component.scss']
})

export class ReassignAnswerComponent {

  @Output() proToAssign: EventEmitter<NewPro> = new EventEmitter<NewPro>();

  private _newPro: NewPro = <NewPro>{};

  constructor() { }

  public emitPro() {
    this.proToAssign.emit(this._newPro);
  }

  public updateCountry(event: {value: Array<any>}) {
    this._newPro.country = event.value[0];
    this.emitPro();
  }

  get newPro(): NewPro {
    return this._newPro;
  }

}
