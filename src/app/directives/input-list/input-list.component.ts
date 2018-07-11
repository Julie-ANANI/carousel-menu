import { Component, Output, EventEmitter, Input } from '@angular/core';
import { TranslateNotificationsService } from '../../services/notifications/notifications.service';

@Component({
  moduleId: module.id,
  selector: 'app-input-list',
  templateUrl: 'input-list.component.html',
  styleUrls: ['input-list.component.scss']
})

export class InputListComponent {

  @Input() set config(config: any) {
    if (config) {
      this._placeholder = config.placeholder || '';
      this.answerList = config.initialData || [];
    }
  }

  @Input() canEdit = true;
  @Input() adminMode = false;
  @Input() isEmail = false;

  @Output() update = new EventEmitter<any>();

  answer: string;
  answerList: Array<any>;
  _placeholder: string;

  constructor(private _notificationsService: TranslateNotificationsService) {}

  addProposition(val: string): void {
    if (this.answerList.findIndex(t => {return t === val}) === -1) {
      // if we want to test if it's an email
      if (this.isEmail) {
        const testValue = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (testValue.test(val)) {
          this.answerList.push({text: val});
          this.answer = '';
          this.update.emit({value: this.answerList});
        } else {
          this._notificationsService.error('ERROR.ERROR', 'COMMON.INVALID.EMAIL');
        }
      } else {
        this.answerList.push({text: val});
        this.answer = '';
        this.update.emit({value: this.answerList});
      }
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

  get placeholder(): string {
    return this._placeholder;
  }

}
