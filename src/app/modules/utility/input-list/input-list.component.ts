import { Component, Output, EventEmitter, Input } from '@angular/core';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { domainRegEx, emailRegEx } from '../../../utils/regex';

@Component({
  moduleId: module.id,
  selector: 'app-input-list',
  templateUrl: './input-list.component.html',
  styleUrls: ['./input-list.component.scss']
})

export class InputListComponent {

  // make input field small.
  @Input() isSmall = false;

  @Input() set config(config: any) {
    if (config) {
      this._placeholder = config.placeholder;
      this._answerList = config.initialData || [];
    }
  }

  @Input() isEditable: boolean = true;

  @Input() isAdminMode: boolean = false;

  @Input() isEmail: boolean = false;

  @Input() isDomain: boolean = false;

  @Output() update: EventEmitter<any> = new EventEmitter<any>();

  public answer: string;

  private _answerList: Array<any>;

  private _placeholder: string = 'COMMON.PLACEHOLDER.INPUT_LIST_DEFAULT';

  private _enableUpdate: boolean = false;

  private _indexNumber: number;

  constructor(private _translateNotificationsService: TranslateNotificationsService) {}

  public addProposition(val: string) {

    if (this._answerList.findIndex(t => { return t.text === val }) === -1) {
      // if we want to test if it's an email
      if (this.isEmail) {
        const testValue = emailRegEx;

        if (testValue.test(val)) {
          this._answerList.push({text: val});
          this.answer = '';
          this.update.emit({ value: this._answerList });
        } else {
          this._translateNotificationsService.error('ERROR.ERROR', 'COMMON.INVALID.EMAIL');
        }

      } else if (this.isDomain) {
        const testValue = domainRegEx;

        if (testValue.test(val)) {
          this._answerList.push({text: val});
          this.answer = '';
          this.update.emit({ value: this._answerList });
        } else {
          this._translateNotificationsService.error('ERROR.ERROR', 'COMMON.INVALID.EMAIL');
        }

      } else {
        this._answerList.push({text: val});
        this.answer = '';
        this.update.emit({ value: this._answerList });
      }

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

    this._answerList[index].text = value;
    this.update.emit({ value: this._answerList });
    this._enableUpdate = false;
    this._indexNumber = null;

  }

  public removeProposition(index: number): void {
    if (this.isEditable) {
      this._answerList.splice(index, 1);
      this.update.emit({ value: this._answerList });
    }
  }

  public thumbsUp(event: Event, index: number): void {
    event.preventDefault();

    if (this.isAdminMode) {
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

    if (this.isAdminMode) {
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

}
