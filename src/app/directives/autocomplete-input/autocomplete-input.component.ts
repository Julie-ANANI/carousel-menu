import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AutocompleteService } from '../../services/autocomplete/autocomplete.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'lodash';

@Component({
  moduleId: module.id,
  selector: 'app-autocomplete-input',
  templateUrl: 'autocomplete-input.component.html',
  styleUrls: ['../input-list/input-list.component.scss']
})

export class AutocompleteInputComponent implements OnInit {

  public inputForm: FormGroup;

  @Output() update = new EventEmitter<any>();

  @Input() canEdit = true;
  @Input() onlyOne = false; // si le booléen est à true, on accepte une seule valeur et non un tableau
  @Input() adminMode = false;

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

  constructor(private formBuilder: FormBuilder,
              private domSanitizer: DomSanitizer,
              private autocompleteService: AutocompleteService) {
  }

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
    this.inputForm = this.formBuilder.group({
      answer : '',
    });
  }

  public suggestions(keyword: any): Observable<Array<{name: string, domain: string, flag: string}>> {
      const queryConf = {
        keyword: keyword,
        type: this._autocompleteType
      };
      return this.autocompleteService.get(queryConf);
  }

  public autocompleListFormatter = (data: any) : SafeHtml => {
    const html = `<span>${data[this._identifier]}</span>
                  <span>${data[this._identifier]}</span>`;
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  };

  public canAdd(): boolean {
    return !this.onlyOne || this.answerList.length === 0;
  }

  addProposition(val: any): void {
    val = val ? val.get('answer').value : '';
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
