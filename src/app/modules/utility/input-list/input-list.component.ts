import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateNotificationsService} from '../../../services/notifications/notifications.service';
import {domainRegEx, emailRegEx} from '../../../utils/regex';
import {ErrorFrontService} from '../../../services/error/error-front.service';

interface InputListConfig {
  placeholder: string;
  initialData: Array<any>;
}

@Component({
  moduleId: module.id,
  selector: 'app-utility-input-list',
  templateUrl: './input-list.component.html',
  styleUrls: ['./input-list.component.scss']
})

export class InputListComponent {

  @Input() isSmall = false; // true: to make input field and button small.

  @Input() isEditable = true; // false: will not allow to edit the fields and perform actions.

  @Input() isAddable = true; // false: will not allow to add new element.

  @Input() isClickable = false; // true: will allow to click on element text.

  @Input() isAdminMode = false; // true: to show the admin options.

  @Input() isEmail = false; // true: if the answerList is of email. ex: app-sidebar-blacklist component

  @Input() isDomain = false; // true: if the answerList is of domain. ex: app-sidebar-blacklist component

  @Input() set config(config: InputListConfig) {
    if (config) {
      this._placeholder = config.placeholder;
      this._answerList = config.initialData || [];
    }
  }

  @Output() update: EventEmitter<any> = new EventEmitter<any>(); // sends the updated list.
  @Output() remove: EventEmitter<any> = new EventEmitter<any>(); // sends the to-remove item.
  @Output() edit: EventEmitter<any> = new EventEmitter<any>(); // sends the edited item.
  @Output() clickItem: EventEmitter<any> = new EventEmitter<any>(); // sends the clicked item.

  private _answer = '';

  private _answerList: Array<any> = [];

  private _placeholder = 'COMMON.PLACEHOLDER.INPUT_LIST_DEFAULT';

  private _enableUpdate = false;

  public isModalDelete = false;
  private _indexNumber: number = null;
  private _indexToDelete: number = null;

  constructor(private _translateNotificationsService: TranslateNotificationsService) { }

  public addProposition(val: string) {
    if (this.isEditable) {
      if (!val) {
        return;
      }
      if (this._answerList.findIndex(t => {
        return t.text === val;
      }) === -1) {
        let _testValue: any;

        // if we want to test if it's an email
        if (this.isEmail) {
          _testValue = emailRegEx;

          if (_testValue.test(val)) {
            this._answerList.push({text: val});
            this._answer = '';
            this.update.emit({ value: this._answerList });
          } else {
            this._translateNotificationsService.error('ERROR.ERROR', 'COMMON.INVALID.EMAIL');
          }

        } else if (this.isDomain) {
          _testValue = domainRegEx;

          if (_testValue.test(val)) {
            this._answerList.push({text: val});
            this._answer = '';
            this.update.emit({ value: this._answerList });
          } else {
            this._translateNotificationsService.error('ERROR.ERROR', 'COMMON.INVALID.DOMAIN');
          }

        } else {
          this._answerList.push({text: val});
          this._answer = '';
          console.log(this._answerList);
          this.update.emit({ value: this._answerList });
        }

      }
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(403));
    }
  }

  public onClickEdit(event: Event, index: number) {
    event.preventDefault();
    if (this.isEditable) {
      if (this._indexNumber === index) {
        this._enableUpdate = !this._enableUpdate;
      } else {
        this._enableUpdate = true;
      }
      this._indexNumber = index;
    }
  }

  public updateProposition(event: Event, index: number, value: string) {
    event.preventDefault();
    // item element to edit can be name or text depending on input list
    const oldValue = this._answerList[index].text || this._answerList[index].name;
    this._answerList[index].text = value;
    this._answerList[index].name = value;
    this.edit.emit({ oldTextValue: oldValue, value: this._answerList[index] });
    this.update.emit({ value: this._answerList });
    this._enableUpdate = false;
    this._indexNumber = null;
  }

  public removeProposition(): void {
    if (this.isEditable) {
      this.remove.emit({ value: this._answerList[this._indexToDelete] });
      this._answerList.splice(this._indexToDelete, 1);
      this.update.emit({ value: this._answerList });
      this._indexToDelete = null;
      this.isModalDelete = false;
    }
  }

  public modalConfirmRemove(index: number) {
    if (this.isEditable) {
      this.isModalDelete = true;
      this._indexToDelete = index;
    }
  }

  public thumbsUp(event: Event, index: number): void {
    event.preventDefault();
    if (this.isAdminMode && this.isEditable) {
      if (this._answerList[index].rating === 2) {
        this._answerList[index].rating = 1;
      } else {
        this._answerList[index].rating = 2;
      }
      this.update.emit({ value: this._answerList });
    }
  }

  public thumbsDown(event: Event, index: number): void {
    event.preventDefault();
    if (this.isAdminMode && this.isEditable) {
      if (this._answerList[index].rating === 0) {
        this._answerList[index].rating = 1;
      } else {
        this._answerList[index].rating = 0;
      }
      this.update.emit({ value: this._answerList });
    }
  }

  get placeholder(): string {
    return this._placeholder;
  }

  get enableUpdate(): boolean {
    return this._enableUpdate;
  }

  get indexNumber(): number {
    return this._indexNumber;
  }

  get answerList(): Array<any> {
    return this._answerList;
  }

  get answer(): string {
    return this._answer;
  }

  set answer(value: string) {
    this._answer = value;
  }

}
