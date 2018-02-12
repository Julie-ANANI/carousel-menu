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
      this.answerList.push(val);
      this.answer = '';
      this.update.emit({value: this.answerList});
    }
  }

  rmProposition(i: number): void {
    this.answerList.splice(i, 1);
    this.update.emit({value: this.answerList});
  }

  thumbsUp(index: number) {
    if (this.adminMode) {
      if (this.answerList[index].rating === 2) {
        this.answerList[index].rating = 1;
      } else {
        this.answerList[index].rating = 2;
      }
      this.update.emit({value: this.answerList});
    }
  }

  thumbsDown(index: number) {
    if (this.adminMode) {
      if (this.answerList[index].rating === 0) {
        this.answerList[index].rating = 1;
      } else {
        this.answerList[index].rating = 0;
      }
      this.update.emit({value: this.answerList});
    }
  }

  updateItem() {
    this.update.emit({value: this.answerList});
  }

}
