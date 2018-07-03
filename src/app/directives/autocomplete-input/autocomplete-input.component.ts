import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AutocompleteService } from '../../services/autocomplete/autocomplete.service';
import { MultilingPipe } from '../../pipes/multiling/multiling.pipe';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'app-autocomplete-input',
  templateUrl: 'autocomplete-input.component.html',
  styleUrls: ['../input-list/input-list.component.scss']
})

export class AutocompleteInputComponent implements OnInit {

  public inputForm: FormGroup;

  @Output() update = new EventEmitter<any>();
  @Output() add = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();


  @Input() canEdit = true;
  @Input() onlyOne = false; // si le booléen est à true, on accepte une seule valeur et non un tableau
  @Input() adminMode = false;
  @Input() multiLangObjects = false;

  companyName: FormControl = new FormControl();
  answerList: Array<{name: string, domain: string, flag: string; url: string, rating: number}> = [];
  answer = '';

  /*
   * Component configuration
   */
  private _placeholder = '';
  private _autocompleteType = '';
  private _identifier: string;
  private _canOrder: boolean;
  ////////////////////////////////////////////////////////////////////


  constructor(private _fbuilder: FormBuilder,
              private _sanitizer: DomSanitizer,
              private _autocompleteService: AutocompleteService,
              private _translateService: TranslateService) {}

  @Input()
  set config(config: {placeholder: string, type: string, initialData: any, identifier: string, canOrder: boolean}) {
    if (config) {
      this._identifier = config.identifier || 'name';
      this._canOrder = config.canOrder || false;
      this._placeholder = config.placeholder || '';
      this._autocompleteType = config.type || '';
      if (config.initialData && Array.isArray(config.initialData)) {
        this.answerList = [];
        config.initialData.forEach(val => {
          if (this.answerList.findIndex(t => {
              return t === val
            }) === -1) {
            this.answerList.push(val);
          }
        });
      }
    }
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

  ngOnInit() {
    this.inputForm = this._fbuilder.group({
      answer : '',
    });
  }

  public suggestions(keyword: any): Observable<Array<{name: string, domain: string, flag: string}>> {
      const queryConf = {
        keyword: keyword,
        type: this._autocompleteType
      };
      return this._autocompleteService.get(queryConf);
  }

  public autocompleListFormatter = (data: any) : SafeHtml => {
    const text = this.autocompleValueFormatter(data);
    return this._sanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  };

  public autocompleValueFormatter = (data: any) : string => {
    if (this.multiLangObjects) {
      return MultilingPipe.prototype.transform(data[this._identifier], this._translateService.currentLang);
    } else {
      return data[this._identifier];
    }
  };

  public canAdd(): boolean {
    return !this.onlyOne || this.answerList.length === 0;
  }

  addProposition(val: any): void {
    val = val ? val.get('answer').value : '';
    if (val) {
      // Verify here if the value has the expected fields (name, logo and domain)
      if (typeof val === 'string') {
        const _obj = {};
        _obj[this._identifier] = val;
        val = _obj;
      }
      if (val && this.answerList.findIndex(t => {return t[this._identifier] === val[this._identifier]}) === -1) {
        if (this.onlyOne) {
          this.answerList = [val];
        } else {
          this.answerList.push(val);
        }
        this.inputForm.get('answer').setValue('');
        this.update.emit({value: this.answerList});
      }
    }
    // Verify here if the value has the expected fields (name, logo and domain)
    if (typeof val === 'string') {
      let _obj = {};
      _obj[this._identifier] = val;
      val = _obj;
    } else if (this.multiLangObjects) {
      val.name = MultilingPipe.prototype.transform(val.name, this._translateService.currentLang);
    }
    if (val && this.answerList.findIndex(t => {return t[this._identifier] === val[this._identifier]}) === -1) {
      if (this.onlyOne) {
        this.answerList = [val];
      } else {
        this.answerList.push(val);
      }
      this.inputForm.get('answer').setValue('');
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

  rmProposition(event: Event, i: number): void {
    event.preventDefault();
    const val = this.answerList.splice(i, 1).pop();
    this.update.emit({value: this.answerList});
    this.remove.emit({value: val});
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

  stringify(v: string): string {
    return JSON.stringify(v);
  }
}
