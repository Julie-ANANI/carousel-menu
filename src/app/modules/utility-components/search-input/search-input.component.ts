import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/Rx';
import { MouseService } from '../../../services/mouse/mouse.service';
import { Subject } from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})

export class SearchInputComponent implements OnInit, OnDestroy {

  @Output() finalValueEmit = new EventEmitter<any>(); // this is the final value that we send to the parent. By default we send only the string type.

  @Input() suggestions: any; // values that we get from the parent component. By default it is Array<{'text': string}> type.

  private _searchField: FormControl; // declare the FormControl as properties of our components.

  private _displaySuggestion = true;

  private _crossIcon = false;

  private _searchActive = false;

  private _currentFocus = -1;

  private _localSuggestions: any = [];

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private mouseService: MouseService) {

    this.mouseService.getClickEvent().pipe(takeUntil(this._ngUnsubscribe)).subscribe((event: Event) => {
      if (event && event.target && event.target['id'] !== 'search-input-component') {
        console.log(event);
      }
    });

  }

  ngOnInit() {
    this._searchField = new FormControl(); // create the form control.

    this._searchField.valueChanges.pipe(takeUntil(this._ngUnsubscribe)).subscribe(input => {
      this._crossIcon = input !== '';
      this._displaySuggestion = true;
      this.searchLocally(input);
    });

  }


  private searchLocally(value: string) {
    this._localSuggestions = [];

    if (value !== null) {
      this.suggestions.forEach((items: any) => {
        const index = this._localSuggestions.findIndex((item: any) => item.text === items.text);
        const temp = items.text.toLowerCase().includes(value.toLowerCase());
        if (temp) {
          if (index === -1) {
            this._localSuggestions.push(items);
          }
        }
      });
    }

  }


  onValueSelect(value: any) {
    this._searchField.setValue(value.text);
    this.finalValueEmit.emit(value.text);
    this._displaySuggestion = false;
    this._crossIcon = true;
  }


  clearInput(event: Event) {
    event.preventDefault();
    this._searchField.reset();
    this._crossIcon = false;
    this.finalValueEmit.emit('');
  }


  closeSearch(event: Event) {
    event.preventDefault();
    this._searchField.reset();
    this._crossIcon = false;
    this.searchActive = !this.searchActive;

    if (this.searchActive === false) {
      this.finalValueEmit.emit('');
    }

  }

  onKeyboardPress(event: Event) {
    this._displaySuggestion = true;

    if (event['key'] === 40 || event['code'] === 'ArrowDown') {
      this._currentFocus++;
      this.setFocus(this._currentFocus);
    } else if (event['key'] === 38 || event['code'] === 'ArrowUp') {
      this._currentFocus--;
      this.setFocus(this._currentFocus);
    } else if (event['key'] === 13 || event['code'] === 'Enter') {
      event.preventDefault();

      if (this._currentFocus > -1) {
        if (this._localSuggestions[this._currentFocus].text !== '') {
          this._searchField.setValue(this._localSuggestions[this._currentFocus].text);
          this._currentFocus = -1;
        }
      }

      this.finalValueEmit.emit(this._searchField.value);
      this._displaySuggestion = false;
    }

  }


  private setFocus(value: number) {
    if (value >= this._localSuggestions.length) {
      this._currentFocus = 0;
    }

    if (value < 0) {
      this._currentFocus = this._localSuggestions.length - 1;
    }

  }

  get searchField(): FormControl {
    return this._searchField;
  }

  get displaySuggestion(): boolean {
    return this._displaySuggestion;
  }

  get crossIcon(): boolean {
    return this._crossIcon;
  }

  get searchActive(): boolean {
    return this._searchActive;
  }

  set searchActive(value: boolean) {
    this._searchActive = value;
  }

  get currentFocus(): number {
    return this._currentFocus;
  }

  get localSuggestions(): any {
    return this._localSuggestions;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
