import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AutocompleteService } from '../../../services/autocomplete/autocomplete.service';
import { MultilingPipe } from '../../../pipe/pipes/multiling.pipe';
import { AutoCompleteInputConfigInterface } from './interfaces/auto-complete-input-config-interface';
import { AnswerList } from './interfaces/auto-complete-input-answerlist-interface';
import { AutoCompleteInputSuggestionInterface } from './interfaces/auto-complete-input-suggestion-interface';

@Component({
  moduleId: module.id,
  selector: 'app-auto-complete-input',
  templateUrl: './auto-complete-input.component.html',
  styleUrls: ['./auto-complete-input.component.scss']
})

export class AutoCompleteInputComponent {

  @Input() tempActive: boolean = true; // its temp don't use it.

  @Input() isEditable: boolean = true; // false: will disable it.

  @Input() isShowable: boolean = true; // false: to hide the form field.

  @Input() isShowButton: boolean = true; // false: to hide the button.

  @Input() isAdmin: boolean = false;

  @Input() onlyOne: boolean = false; // si le booléen est à true, on accepte une seule valeur et non un tableau

  @Input() set config(config: AutoCompleteInputConfigInterface) {
    if (config) {

      this._identifier = config.identifier || 'name';
      this._canOrder = config.canOrder || false;
      this._placeholder = config.placeholder || 'COMMON.PLACEHOLDER.INPUT_LIST_DEFAULT';
      this._autocompleteType = config.type || '';

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

  @Output() update = new EventEmitter<any>();

  @Output() add = new EventEmitter<any>();

  @Output() remove = new EventEmitter<any>();

  @Input() canEdit = true;

  @Input() forceSelection = false; // si le booléen est à true, on accepte un string hors auto-complete



  @Input() adminMode = false;

  @Input() multiLangObjects = false;

  @Input() addButton = true; // this is to add the plus button.





  private readonly _autoCompleteInputForm: FormGroup;

  companyName: FormControl = new FormControl();

  private _answerList: Array<AnswerList> = [];

  answer = '';

  private _placeholder: string;

  private _autocompleteType: string;

  private _identifier: string;

  private _canOrder: boolean;

  constructor(private _formBuilder: FormBuilder,
              private _domSanitizer: DomSanitizer,
              private _autocompleteService: AutocompleteService,
              private _multilingPipe: MultilingPipe,
              private _translateService: TranslateService) {

    this._autoCompleteInputForm = this._formBuilder.group({
      answer: '',
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
    return this._domSanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  }

  private _autocompleteValueFormatter(data: any): string {
    if (this.multiLangObjects) {
      return this._multilingPipe.transform(data[this._identifier], this._translateService.currentLang);
    } else {
      return data[this._identifier];
    }
  }

  public addProposition(val: any): void {
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

  }

  up(event: Event, i: number): void {
    event.preventDefault();

    if (i !== 0) {
      const elem = this._answerList.splice(i, 1);
      this._answerList.splice(i - 1, 0, elem[0]);
      this.update.emit({value: this._answerList});
    }

  }

  down(event: Event, i: number): void {
    event.preventDefault();

    if (i !== this._answerList.length - 1) {
      const elem = this._answerList.splice(i, 1);
      this._answerList.splice(i + 1, 0, elem[0]);
      this.update.emit({value: this._answerList});
    }

  }

  public removeProposition(index: number) {
    if (this.isEditable || this.isAdmin) {
      const val = this._answerList.splice(index, 1).pop();
      this.update.emit({ value: this._answerList });
      this.remove.emit({ value: val });
    }
  }

  thumbsUp(event: Event, index: number): void {
    event.preventDefault();

    if (this.adminMode) {
      if (this._answerList[index].rating === 2) {
        this._answerList[index].rating = 1;
      } else {
        this._answerList[index].rating = 2;
      }
      this.update.emit({value: this._answerList});
    }

  }

  thumbsDown(event: Event, index: number): void {
    event.preventDefault();

    if (this.adminMode) {
      if (this._answerList[index].rating === 0) {
        this._answerList[index].rating = 1;
      } else {
        this._answerList[index].rating = 0;
      }
      this.update.emit({value: this._answerList});
    }

  }

  updateItem(event: Event): void {
    event.preventDefault();
    this.update.emit({value: this._answerList});
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

}
