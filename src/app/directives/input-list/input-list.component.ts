import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-input-list',
  templateUrl: 'input-list.component.html',
  styleUrls: ['input-list.component.scss']
})

export class InputListComponent {
  _placeholder: string;

  @Output() update = new EventEmitter<any>();
  @Input() canEdit = true;
  @Input() adminMode = false;

  answer: string;
  answerList: Array<any>;

  @Input()
  set config(config: any) {
    if (config) {
      this._placeholder = config.placeholder || '';
      this.answerList = config.initialData || [];
    }
  }

  constructor() {}

  get placeholder(): string {
    return this._placeholder;
  }

  addProposition(val: string): void {
    if (this.answerList.findIndex(t => {return t === val}) === -1) {
      this.answerList.push({text: val});
      this.answer = '';
      this.update.emit({value: this.answerList});
    }
  }

  rmProposition(i: number): void {
    this.answerList.splice(i, 1);
    this.update.emit({value: this.answerList});
  }

  thumbsUp(event: Event, index: number): void {
    event.preventDefault();
    if (this.adminMode) {
      if (this.answerList[index].rating === 2) {
        this.answerList[index].rating = 1;
      } else {
        this.answerList[index].rating = 2;
      }
      this.update.emit({value: this.answerList});
    }
  }

  thumbsDown(event: Event, index: number): void {
    event.preventDefault();
    if (this.adminMode) {
      if (this.answerList[index].rating === 0) {
        this.answerList[index].rating = 1;
      } else {
        this.answerList[index].rating = 0;
      }
      this.update.emit({value: this.answerList});
    }
  }

  updateItem(event: Event): void {
    event.preventDefault();
    this.update.emit({value: this.answerList});
  }

}
