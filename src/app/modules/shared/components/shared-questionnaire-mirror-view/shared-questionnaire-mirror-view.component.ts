import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Language } from "../../../../models/static-data/language";

@Component({
  selector: 'app-shared-questionnaire-mirror-view',
  templateUrl: 'shared-questionnaire-mirror-view.component.html',
  styleUrls: ['./shared-questionnaire-mirror-view.component.scss']
})

export class SharedQuestionnaireMirrorViewComponent implements OnInit {
  @Input() showDropDown = true;

  @Input() set languageSelected(value: Language){
    this._languageSelected = value;
  }

  @Input() set languagesExcludedInSelector(value: Array<Language>){
    this._languagesExcludedInSelector = value;
  }

  @Input() set languagesList(value: Array<Language>){
    this._languagesList = value;
  }

  @Output() languageSelectedChange: EventEmitter<Language> = new EventEmitter<Language>();

  private _languagesExcludedInSelector: Array<Language> = [];

  private _languagesList: Array<Language> = [];

  private _languageSelected: Language;

  constructor() {
  }

  ngOnInit() {

  }

  selectMirrorLanguage(event: Event, lang: Language) {
    event.preventDefault();
    this._languageSelected = lang;
    this.languageSelectedChange.emit(this._languageSelected);
  }

  hiddenLanguageItem(lang: Language){
    return !this._languagesExcludedInSelector.find(language => language.type === lang.type);
  }

  get languagesExcludedInSelector(): Array<Language> {
    return this._languagesExcludedInSelector;
  }


  get languageSelected(): Language {
    return this._languageSelected;
  }

  get languagesList(): Array<Language> {
    return this._languagesList;
  }
}
