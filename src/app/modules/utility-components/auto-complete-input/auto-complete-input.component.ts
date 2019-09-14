import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AutocompleteService } from '../../../services/autocomplete/autocomplete.service';
import { MultilingPipe } from '../../../pipe/pipes/multiling.pipe';

@Component({
  moduleId: module.id,
  selector: 'app-auto-complete-input',
  templateUrl: './auto-complete-input.component.html',
  styleUrls: ['./auto-complete-input.component.scss']
})

export class AutoCompleteInputComponent {

  @Input() tempActive: boolean = true; // its temp don't use it.

  @Input() isEditable: boolean = true; // false: will disable it.

  @Input() isShowable: boolean = true; // false: to hide the input field.

  @Input() isShowButton: boolean = true; // false: to hide the button.

  @Input() isAdmin: boolean = false;

  @Input() set config(config: { placeholder: string, type: string, initialData: any, identifier: string, canOrder: boolean }) {
    if (config) {

      this._identifier = config.identifier || 'name';
      this._canOrder = config.canOrder || false;
      this._placeholder = config.placeholder || 'COMMON.PLACEHOLDER.INPUT_LIST_DEFAULT';
      this._autocompleteType = config.type || '';

      if (config.initialData && Array.isArray(config.initialData)) {
        this.answerList = [];

        config.initialData.forEach(value => {
          if (this.answerList.findIndex(t => {
            return t === value;
          }) === -1) {
            this.answerList.push(value);
          }
        });
      }

    }
  }

  @Output() update = new EventEmitter<any>();

  @Output() add = new EventEmitter<any>();

  @Output() remove = new EventEmitter<any>();


  @Input() canEdit = true;

  @Input() forceSelection = false; // si le booléen est à true, on accepte un string hors auto-complete

  @Input() onlyOne = false; // si le booléen est à true, on accepte une seule valeur et non un tableau

  @Input() adminMode = false;

  @Input() multiLangObjects = false;

  @Input() addButton = true; // this is to add the plus button.





  autoCompleteInputForm: FormGroup;

  companyName: FormControl = new FormControl();

  answerList: Array<{name: string, domain: string, flag: string; url: string, rating: number}> = [];

  answer = '';

  private _placeholder: string;

  private _autocompleteType: string;

  private _identifier: string;

  private _canOrder: boolean;

  private _customAnswerList: Array<any> = [];

  constructor(private _formBuilder: FormBuilder,
              private _domSanitizer: DomSanitizer,
              private _autocompleteService: AutocompleteService,
              private _multilingPipe: MultilingPipe,
              private _translateService: TranslateService) {

    this.autoCompleteInputForm = this._formBuilder.group({
      answer: '',
    });

  }

  public suggestions(query: any): Observable<Array<{name: string, domain: string, flag: string}>> {
    const queryConf = {
      query: query,
      type: this._autocompleteType
    };
    return this._autocompleteService.get(queryConf);
  }

  public autocompleteListFormatter(data: any): SafeHtml {
    const text = this._autocompleteValueFormatter(data);
    return this._domSanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  }

  private _autocompleteValueFormatter(data: any): string {
    if (this.multiLangObjects) {
      return this._multilingPipe.transform(data[this._identifier], this._translateService.currentLang);
    } else {
      return data[this._identifier];
    }
  }

  addProposition(val: any): void {
    val = val ? val.get('answer').value : '';

    if (val) {
      // Verify here if the value has the expected fields (name, logo and domain)
      if (typeof val === 'string') {
        val = {[this._identifier]: val};
      }
      if (val && this.answerList.findIndex((t: any) => t[this._identifier] === val[this._identifier]) === -1) {
        if (this.onlyOne) {
          this.answerList = [val];
        } else {
          this.answerList.push(val);
        }
        this.autoCompleteInputForm.get('answer').setValue('');
        this.update.emit({value: this.answerList});
      }
    }

    // Verify here if the value has the expected fields (name, logo and domain)
    if (typeof val === 'string') {
      val = {[this._identifier]: val};
    } else if (this.multiLangObjects) {
      val.name = this._multilingPipe.transform(val.name, this._translateService.currentLang);
    }

    if (val && this.answerList.findIndex((t: any) => t[this._identifier] === val[this._identifier]) === -1) {
      if (this.onlyOne) {
        this.answerList = [val];
      } else {
        this.answerList.push(val);
      }
      this.autoCompleteInputForm.get('answer').setValue('');
      this.update.emit({value: this.answerList});
      this.add.emit({value: val});
    }

  }

  up(event: Event, i: number): void {
    event.preventDefault();

    if (i !== 0) {
      const elem = this.answerList.splice(i, 1);
      this.answerList.splice(i - 1, 0, elem[0]);
      this.update.emit({value: this.answerList});
    }

  }

  down(event: Event, i: number): void {
    event.preventDefault();

    if (i !== this.answerList.length - 1) {
      const elem = this.answerList.splice(i, 1);
      this.answerList.splice(i + 1, 0, elem[0]);
      this.update.emit({value: this.answerList});
    }

  }

  public removeProposition(index: number) {
    const val = this.answerList.splice(index, 1).pop();
    this.update.emit({ value: this.answerList });
    this.remove.emit({ value: val });
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

  get canAdd(): boolean {
    return this.autoCompleteInputForm.get('answer').value && (!this.onlyOne || this.answerList.length === 0);
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

  get customAnswerList(): Array<any> {
   return this._customAnswerList;
  }

}

/*
export class AutocompleteInputComponent {

  @Input() set config(config: { placeholder: string, type: string, initialData: any, identifier: string, canOrder: boolean }) {

    if (config) {
      this._identifier = config.identifier || 'name';
      this._canOrder = config.canOrder || false;
      this._placeholder = config.placeholder || '';
      this._autocompleteType = config.type || '';

      if (config.initialData && Array.isArray(config.initialData)) {
        this._answerList = [];

        config.initialData.forEach(val => {
          if (this._answerList.findIndex(t => {
            return t === val;
          }) === -1) {
            this._answerList.push(val);
          }
        });

      }

    }

  }

  @Input() set adminMode(value: boolean) {
    this._adminMode = value;
  }

  @Input() set canEdit(value: boolean) {
    this._canEdit = value;
  }

  @Input() forceSelection = false; // si le booléen est à true, on accepte un string hors auto-complete

  @Input() onlyOne = false; // si le booléen est à true, on accepte une seule valeur et non un tableau

  @Input() multiLangObjects = false;

  @Output() update = new EventEmitter<any>();

  @Output() add = new EventEmitter<any>();

  @Output() remove = new EventEmitter<any>();

  private readonly _autoCompleteForm: FormGroup;

  private _answerList: Array<{name: string, domain: string, flag: string; url: string, rating: number}> = [];

  private _answer: string = '';

  private _placeholder = 'COMMON.PLACEHOLDER.INPUT_LIST_DEFAULT';

  private _autocompleteType = '';

  private _identifier: string;

  private _canOrder: boolean;

  private _adminMode: boolean = false;

  private _canEdit: boolean = true;

  private _enableInputEdit: boolean = false;

  private _indexNumber: number;

  constructor(private _formBuilder: FormBuilder,
              private _sanitizer: DomSanitizer,
              private _autocompleteService: AutocompleteService,
              private _multiling: MultilingPipe,
              private _translateService: TranslateService) {

    this._autoCompleteForm = this._formBuilder.group({
      answer : '',
      updateAnswer : '',
    });

  }

  public suggestions(query: any): Observable<Array<{name: string, domain: string, flag: string}>> {
    const queryConf = {
      query: query,
      type: this._autocompleteType
    };
    return this._autocompleteService.get(queryConf);
  }

  public autocompleteListFormatter(data: any): SafeHtml {
    const text = this.autocompleteValueFormatter(data);
    return this._sanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  }

  public autocompleteValueFormatter(data: any): string {
    if (this.multiLangObjects) {
      return this._multiling.transform(data[this._identifier], this._translateService.currentLang);
    } else {
      return data[this._identifier];
    }
  }

  public addProposition(val: any): void {
    val = val ? val.get('answer').value : '';

    console.log(val);

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
        this._autoCompleteForm.get('answer').setValue('');
        this.update.emit({ value: this._answerList });
      }
    }

    // Verify here if the value has the expected fields (name, logo and domain)
    if (typeof val === 'string') {
      val = {[this._identifier]: val};
    } else if (this.multiLangObjects) {
      val.name = this._multiling.transform(val.name, this._translateService.currentLang);
    }

    if (val && this._answerList.findIndex((t: any) => t[this._identifier] === val[this._identifier]) === -1) {
      if (this.onlyOne) {
        this._answerList = [val];
      } else {
        this._answerList.push(val);
      }
      this._autoCompleteForm.get('answer').setValue('');
      this.update.emit({value: this._answerList});
      this.add.emit({value: val});
    }

  }

  public onClickUpIcon(event: Event, index: number) {
    event.preventDefault();

    if (index !== 0) {
      const elem = this._answerList.splice(index, 1);
      this._answerList.splice(index - 1, 0, elem[0]);
      this.update.emit({ value: this._answerList } );
    }

  }

  public onClickDownIcon(event: Event, index: number) {
    event.preventDefault();

    if (index !== this._answerList.length - 1) {
      const elem = this._answerList.splice(index, 1);
      this._answerList.splice(index + 1, 0, elem[0]);
      this.update.emit({ value: this._answerList });
    }

  }

  public onClickEdit(event: Event, index: number) {
    event.preventDefault();

    if (this._indexNumber === index) {
      this._enableInputEdit = !this._enableInputEdit;
    } else {
      this._enableInputEdit = true;
    }

    this._indexNumber = index;
  }

  public removeProposition(event: Event, index: number): void {
    event.preventDefault();
    const val = this._answerList.splice(index, 1).pop();
    this.update.emit({ value: this._answerList });
    this.remove.emit({ value: val });
  }

  public thumbsUp(event: Event, index: number): void {
    event.preventDefault();

    if (this.adminMode) {
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

    if (this.adminMode) {
      if (this._answerList[index].rating === 0) {
        this._answerList[index].rating = 1;
      } else {
        this._answerList[index].rating = 0;
      }
      this.update.emit({ value: this._answerList });
    }

  }

  /!*  updateItem(event: Event): void {
      event.preventDefault();
      this.update.emit({value: this._answerList});
    }*!/

  public updateProposition(event: Event, index: number, value: any) {
    event.preventDefault();
    this._answerList[index] = value ? value.get('updateAnswer').value : '';
    this.update.emit({ value: this._answerList });
    this._enableInputEdit = false;
    this._indexNumber = null;
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

  get canAdd(): boolean {
    return this._autoCompleteForm.get('answer').value && (!this.onlyOne || this._answerList.length === 0);
  }

  get adminMode(): boolean {
    return this._adminMode;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }

  get autoCompleteForm(): FormGroup {
    return this._autoCompleteForm;
  }

  get answer(): string {
    return this._answer;
  }

  get enableInputEdit(): boolean {
    return this._enableInputEdit;
  }

  get indexNumber(): number {
    return this._indexNumber;
  }

  get answerList(): Array<{ name: string; domain: string; flag: string; url: string; rating: number }> {
    return this._answerList;
  }

}
*/
