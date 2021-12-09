import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {AutocompleteService} from '../../../services/autocomplete/autocomplete.service';
import {MultilingPipe} from '../../../pipe/pipes/multiling.pipe';
import {AutoCompleteInputConfigInterface} from './interfaces/auto-complete-input-config-interface';
import {AnswerList} from './interfaces/auto-complete-input-answerlist-interface';
import {AutoCompleteInputSuggestionInterface} from './interfaces/auto-complete-input-suggestion-interface';
import {TranslateNotificationsService} from '../../../services/translate-notifications/translate-notifications.service';
import {ErrorFrontService} from '../../../services/error/error-front.service';
import {Enterprise} from '../../../models/enterprise';

@Component({
  moduleId: module.id,
  selector: 'app-utility-auto-complete-input',
  templateUrl: './auto-complete-input.component.html',
  styleUrls: ['./auto-complete-input.component.scss']
})

export class AutoCompleteInputComponent implements OnInit {
  @Input() set config(config: AutoCompleteInputConfigInterface) {
    if (config) {

      this._identifier = config.identifier || 'name';
      this._canOrder = config.canOrder || false;
      this._placeholder = config.placeholder || 'COMMON.PLACEHOLDER.INPUT_LIST_DEFAULT';
      this._autocompleteType = config.type || '';
      this._domain = !!config.showDomain;

      if (config.initialData && Array.isArray(config.initialData)) {
        this._answerList = [];

        config.initialData.forEach(value => {
          if (this._answerList.findIndex(t => {
            return t === value;
          }) === -1) {
            this._answerList.push(value);
          }
        });

      }

    }
  }

  @Input() isSmall = false; // true: to make input field and button small.

  @Input() isEditable = true; // false: will not allow to edit the fields and perform actions.

  @Input() isShowable = true; // false: to hide the form field and add button.

  @Input() isShowButton = true; // false: to hide the button.

  @Input() isAdmin = false; // true: to show the admin options.

  @Input() onlyOne = false; // si le booléen est à true, on accepte une seule valeur et non un tableau

  @Input() multiLangObjects = false;

  @Input() onlyDomain = false;

  @Input() isHideAnswerList = false; // true: to hide the answer list.

  @Output() update: EventEmitter<any> = new EventEmitter<any>(); // sends the updated list.

  @Output() add: EventEmitter<any> = new EventEmitter<any>(); // send the single new added answer

  @Output() remove: EventEmitter<any> = new EventEmitter<any>(); // send the single answer that needs to be removed

  private _autoCompleteInputForm: FormGroup;

  private _answerList: Array<AnswerList> = [];

  private _answer = '';

  private _placeholder = '';

  private _autocompleteType = '';

  private _identifier = '';

  private _canOrder = false;

  private _domain = false;

  constructor(private _formBuilder: FormBuilder,
              private _domSanitizer: DomSanitizer,
              private _autocompleteService: AutocompleteService,
              private _multilingPipe: MultilingPipe,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateService: TranslateService) {
  }

  ngOnInit(): void {
    this._autoCompleteInputForm = this._formBuilder.group({
      answer: [{value: '', disabled: !this.isEditable}],
    });
  }

  public suggestions(query: any): Observable<Array<AutoCompleteInputSuggestionInterface>> {
    const queryConf = {
      query: query,
      type: this._autocompleteType
    };
    return this._autocompleteService.get(queryConf);
  }

  public autocompleteListFormatter(data: any): SafeHtml {
    const text = this._autocompleteValueFormatter(data);
    const domain = this._domain && !!data.domain ? data.domain : undefined;
    return this._domSanitizer.bypassSecurityTrustHtml(`<span>${text} ${!!domain ? '(' + domain + ')' : ''}</span>`);
  }

  private _autocompleteValueFormatter(data: any): string {
    if (this.multiLangObjects) {
      return this._multilingPipe.transform(data[this._identifier], this._translateService.currentLang);
    } else {
      return data[this._identifier];
    }
  }

  public addProposition(val: any): void {
    if (this.isEditable) {
      val = val ? val.get('answer').value : '';

      if (val) {

        // Verify here if the value has the expected fields (name, logo and domain)
        if (typeof val === 'string') {
          val = {[this._identifier]: val};
        }

        if (val && this._answerList.findIndex((t: any) => t[this._identifier] === val[this._identifier]) === -1) {
          if (this.onlyOne) {
            this._answerList = [val];
          } else {
            this._answerList.push(val);
          }

          this._autoCompleteInputForm.get('answer').setValue('');
          this.update.emit({value: this._answerList});
        }

      }

      // Verify here if the value has the expected fields (name, logo and domain)
      if (typeof val === 'string') {
        val = {[this._identifier]: val};
      } else if (this.multiLangObjects) {
        val.name = this._multilingPipe.transform(val.name, this._translateService.currentLang);
      }

      if (val && this._answerList.findIndex((t: any) => t[this._identifier] === val[this._identifier]) === -1) {
        if (this.onlyOne) {
          this._answerList = [val];
        } else {
          this._answerList.push(val);
        }

        this._autoCompleteInputForm.get('answer').setValue('');
        this.update.emit({value: this._answerList});
        this.add.emit({value: val});
      }
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(403));
    }
  }

  public onClickOrderUp(event: Event, i: number): void {
    event.preventDefault();
    if (i !== 0 && this.isEditable) {
      const elem = this._answerList.splice(i, 1);
      this._answerList.splice(i - 1, 0, elem[0]);
      this.update.emit({value: this._answerList});
    }
  }

  public onClickOrderDown(event: Event, i: number): void {
    event.preventDefault();
    if (i !== this._answerList.length - 1 && this.isEditable) {
      const elem = this._answerList.splice(i, 1);
      this._answerList.splice(i + 1, 0, elem[0]);
      this.update.emit({value: this._answerList});
    }
  }

  public removeProposition(index: number) {
    if (this.isEditable) {
      const val = this._answerList.splice(index, 1).pop();
      this.update.emit({value: this._answerList});
      this.remove.emit({value: val});
    }
  }

  public thumbsUp(event: Event, index: number): void {
    event.preventDefault();
    if (this.isAdmin && this.isEditable) {
      if (this._answerList[index].rating === 2) {
        this._answerList[index].rating = 1;
      } else {
        this._answerList[index].rating = 2;
      }

      this.update.emit({value: this._answerList});
    }
  }

  public thumbsDown(event: Event, index: number): void {
    event.preventDefault();
    if (this.isAdmin && this.isEditable) {
      if (this._answerList[index].rating === 0) {
        this._answerList[index].rating = 1;
      } else {
        this._answerList[index].rating = 0;
      }
      this.update.emit({value: this._answerList});
    }
  }

  public updateItem(event: Event): void {
    event.preventDefault();
    this.update.emit({value: this._answerList});
  }

  public answerFormatter = (answer: any): string => {
    return `${answer[this.identifier]} ${!!this._domain && !!answer.domain ? '(' + answer.domain + ')' : ''}`;
  };

  selectedCompany(c: string | Enterprise | any) {
    if (typeof c === 'object' && this.isEditable) {
      if (this.onlyOne) {
        this._answerList = [c];
      } else {
        this._answerList.push(c);
      }
      this.update.emit({value: this._answerList});
      this._autoCompleteInputForm.get('answer').setValue('');
    }
  }

  get canAdd(): boolean {
    return this._autoCompleteInputForm.get('answer').value && (!this.onlyOne || this._answerList.length === 0);
  }

  get placeholder(): string {
    return this._placeholder;
  }

  get identifier(): string {
    return this._identifier;
  }

  get canOrder(): boolean {
    return this._canOrder;
  }

  get autoCompleteInputForm(): FormGroup {
    return this._autoCompleteInputForm;
  }

  get answerList(): Array<AnswerList> {
    return this._answerList;
  }

  get answer(): string {
    return this._answer;
  }

  set answer(value: string) {
    this._answer = value;
  }
}
