import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { AutocompleteService } from '../../services/autocomplete/autocomplete.service';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
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

  companyName: FormControl = new FormControl();
  answerList: Array<{name: string, domain: string, flag: string}> = [];
  optionsList: Array<any> = [];//Observable<{name: string, domain: string, flag: string}[]>;
  answer = "";

  /*
   * Component configuration
   */
  private _placeholder = "";
  private _autocompleteType = "";
  private _identifier: string;
  ////////////////////////////////////////////////////////////////////

  constructor(private _fbuilder: FormBuilder,
              private _sanitizer: DomSanitizer,
              private _autocompleteService: AutocompleteService) {}

  @Input()
  set config(config: {placeholder: string, type: string, initialData: any, identifier: string}) {
    if (config) {
      this._identifier = config.identifier || 'name';
      this._placeholder = config.placeholder || '';
      this._autocompleteType = config.type || '';
      if (config.initialData && Array.isArray(config.initialData)) {
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

  ngOnInit() {
    this.inputForm = this._fbuilder.group({
      answer : "",
    });
  }

  public suggestions(keyword: any) {
      const queryConf = {
        keyword: keyword,
        type: this._autocompleteType
      };
      return this._autocompleteService.get(queryConf).catch(_=>[]);
  }

  public autocompleListFormatter = (data: any) : SafeHtml => {
    let html = `<span>${data[this._identifier]}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  };

  addProposition(val: any): void {
    val = val ? val.get('answer').value : '';
    // Verify here if the value has the expected fields (name, logo and domain)
    if (typeof val === 'string') {
      let _obj = {};
      _obj[this._identifier] = val;
      val = _obj;
    }
    if (val && this.answerList.findIndex(t => {return t[this._identifier] === val[this._identifier]}) === -1) {
      this.answerList.push(val);
      this.inputForm.get('answer').setValue('');
      this.update.emit({value: this.answerList});
    }
  }

  rmProposition(i: number): void {
    this.answerList.splice(i, 1);
    this.update.emit({value: this.answerList});
  }

}
