import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Company} from '../../../models/company';
import {Enterprise} from '../../../models/enterprise';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AutocompleteService} from '../../../services/autocomplete/autocomplete.service';

@Component({
  selector: 'app-auto-complete-company',
  templateUrl: './auto-complete-company.component.html',
  styleUrls: ['./auto-complete-company.component.scss']
})
export class AutoCompleteCompanyComponent implements OnInit, OnDestroy {

  get companiesSuggestion(): Array<Company | Enterprise> {
    return this._companiesSuggestion;
  }

  get displayCompanySuggestion(): boolean {
    return this._displayCompanySuggestion;
  }

  get company(): Company | Enterprise {
    return this._company;
  }

  /**
   * make the input field not editable
   */
  @Input() isDisabled = false;

  /**
   * to make the input field height small
   */
  @Input() isSmall = false;

  /**
   * input id
   */
  @Input() inputId = '';

  /**
   * to show or hide the shadowed effect of the input field
   */
  @Input() hasShadowed = false;

  @Input() placeholder = 'COMMON.PLACEHOLDER.COMPANY';

  @Input() set company(value: Company | Enterprise) {
    this._company = value;
  }

  @Output() companyChange: EventEmitter<Company | Enterprise> = new EventEmitter<Company | Enterprise>();

  private _company: Company | Enterprise = <Company | Enterprise>{};

  private _displayCompanySuggestion = false;

  private _companiesSuggestion: Array<Company | Enterprise> = [];

  private _subscribe: Subject<any> = new Subject<any>();

  constructor(private _autoCompleteService: AutocompleteService) { }

  ngOnInit() {
  }

  public onSuggestCompanies() {
    if (this._company.name && this._company.name.length > 2 && !this.isDisabled) {
      this._displayCompanySuggestion = true;
      this._companiesSuggestion = [];
      const _query = {query: this._company.name, type: 'company'};

      this._autoCompleteService.get(_query)
        .pipe(takeUntil(this._subscribe))
        .subscribe((res: Array<Company | Enterprise>) => {

          if (res.length === 0) {
            this._displayCompanySuggestion = false;
          } else {
            res.forEach((_item: Company | Enterprise) => {
              const index = this._companiesSuggestion.findIndex((_company) => {
                return _company.name.toLowerCase() === _item.name.toLowerCase();
              });
              if (index === -1) {
                this._companiesSuggestion.push(_item);
              }
            });
          }

          this._companiesSuggestion = this._companiesSuggestion.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
      });
    }
  }

  public onSelectCompany(event: Company | Enterprise) {
    this._company = event;
    this._displayCompanySuggestion = false;
    this.companyChange.emit(this._company);
  }

  ngOnDestroy(): void {
    this._subscribe.next();
    this._subscribe.complete();
  }

}
