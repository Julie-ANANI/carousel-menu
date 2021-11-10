import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MissionQuestion, MissionTemplateSection } from '../../../../../models/mission';
import { picto, Picto } from '../../../../../models/static-data/picto';
import { TranslateService } from '@ngx-translate/core';
import { MissionQuestionService } from '../../../../../services/mission/mission-question.service';
import { RolesFrontService } from '../../../../../services/roles/roles-front.service';
import { AutoSuggestionConfig } from '../../../../utility/auto-suggestion/interface/auto-suggestion-config';
import { MissionFrontService } from '../../../../../services/mission/mission-front.service';
import { MissionService } from '../../../../../services/mission/mission.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';

interface AddQuestion {
  from: 'SCRATCH' | 'LIBRARY';
  value: any;
}

interface IdentifierError {
  letter: boolean;
  exist: boolean;
}

@Component({
  selector: 'app-shared-questionnaire-section',
  templateUrl: './shared-questionnaire-section.component.html',
  styleUrls: ['./shared-questionnaire-section.component.scss']
})
export class SharedQuestionnaireSectionComponent implements OnInit {

  get isCheckingAvailability(): boolean {
    return this._isCheckingAvailability;
  }

  get isAvailableIdentifier(): boolean {
    return this._isAvailableIdentifier;
  }

  get isDisabled(): boolean {
    if (this._questionToAdd.from === 'LIBRARY') {
      return this._questionToAdd.value.length === 0;
    } else if (this._questionToAdd.from === 'SCRATCH') {
      return !this._questionToAdd.value['identifier'] || !this._questionToAdd.value['controlType']
        || !this._isAvailableIdentifier;
    }
    return true;
  }

  get identifierError(): IdentifierError {
    return this._identifierError;
  }

  get searchConfig(): AutoSuggestionConfig {
    return this._searchConfig;
  }

  get questionToAdd(): AddQuestion {
    return this._questionToAdd;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get sectionTypes(): Array<string> {
    return this._sectionTypes;
  }

  get questionnaireLangs(): Array<string> {
    return this._missionQuestionService.questionnaireLangs;
  }

  get sectionsNames(): Array<string> {
    return this._missionQuestionService.sectionsNames;
  }

  get sections(): Array<MissionTemplateSection> {
    return this._missionQuestionService.template && this._missionQuestionService.template.sections || [];
  }

  get editSection(): boolean {
    return this._editSection;
  }

  set editSection(value: boolean) {
    this._editSection = value;
  }

  get platformLang() {
    return this._translateService.currentLang;
  }

  get picto(): Picto {
    return this._picto;
  }

  get isCollapsed(): boolean {
    return this._isCollapsed;
  }

  set isCollapsed(value: boolean) {
    this._isCollapsed = value;
  }

  get sectionIndex(): number {
    return this._sectionIndex;
  }

  get section(): MissionTemplateSection {
    return this._section;
  }

  /**
   * its true if we are integrating this under Library route.
   * because there we are editing the use case template or questions directly from the collections.
   */
  @Input() isLibraryView = false;

  /**
   * provide the access path if you are not providing the isEditable input value to give access
   * to the functionalities.
   * Example: use it on the Libraries page.
   */
  @Input() accessPath: Array<string> = [];

  /**
   * can be edit or not.
   */
  @Input() isEditable = false;

  @Input() set sectionIndex(value: number) {
    this._sectionIndex = value;
  }

  @Input() set section(value: MissionTemplateSection) {
    this._section = value || <MissionTemplateSection>{};
    console.log(this._section);
  }

  /**
   * do not change this as we are using this under the Library page use case.
   */
  @Output() valueToSave: EventEmitter<any> = new EventEmitter<any>();

  private _picto: Picto = picto;

  private _isCollapsed = false;

  private _section: MissionTemplateSection = <MissionTemplateSection>{};

  private _sectionIndex = 0;

  private _editSection = false;

  private _sectionTypes: Array<string> = ['ISSUE', 'SOLUTION', 'CONTEXT', 'NOTHING'];

  private _showModal = false;

  private _questionToAdd: AddQuestion = <AddQuestion>{};

  private _searchConfig: AutoSuggestionConfig = {
    minChars: 3,
    type: 'questions',
    identifier: 'label',
    placeholder: 'Start typing question label here...',
  };

  private _identifierError: IdentifierError = <IdentifierError>{};

  private _isAvailableIdentifier = false;

  private _isCheckingAvailability = false;

  constructor(private _translateService: TranslateService,
              private _rolesFrontService: RolesFrontService,
              private _missionService: MissionService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _missionQuestionService: MissionQuestionService) {
  }

  ngOnInit() {
  }

  public addNewQuestion(event: Event) {
    event.preventDefault();
    if (this.canAccess(['question', 'add']) && this.isLibraryView) {
      this._questionToAdd = <AddQuestion>{};
      this._showModal = true;
    } else if (this.isEditable) {
      this._missionQuestionService.addQuestion(this._sectionIndex);
    }
  }

  public up(event: Event) {
    event.preventDefault();
    if (this._sectionIndex > 0) {
      this._missionQuestionService.moveSection(this._sectionIndex, -1);
    }
  }

  public down(event: Event) {
    event.preventDefault();
    if (this._sectionIndex < (this.sections.length - 1)) {
      this._missionQuestionService.moveSection(this._sectionIndex, 1);
    }
  }

  public sectionName(lang: string): string {
    const index = lang === 'en' ? 0 : 1;
    if (this.sectionIdentifier()) {
      const titles = this.sectionIdentifier().split('||');
      if (titles[index] === 'No section' || titles[index] === 'Pas de section') {
        return MissionQuestionService.entryInfo(this._section, lang)['name'] || '';
      } else {
        return titles[index];
      }
    }
    return MissionQuestionService.entryInfo(this._section, lang)['name'] || '';
  }

  public removeSection(event: Event): void {
    event.preventDefault();
    const res = confirm('Do you really want to delete this section? Please note it would not be deleted until you save the changes.');
    if (res) {
      this._missionQuestionService.removeSection(this._sectionIndex);
    }
  }

  public onChangeName(value: string, lang: string) {
    if (this.isEditable || this.canAccess(['section', 'edit', 'name'])) {
      this._missionQuestionService.changeSectionName(value, lang, this._section);
    }
  }

  public sectionIdentifier(): string {
    return this.sectionsNames.length > 0 ? this.sectionsNames[Number(this._section.identifier)] : this._section.identifier;
  }

  public notifyChanges() {
    if (this.isEditable || this.canAccess(['section', 'edit', 'type'])) {
      this._missionQuestionService.setNotifyChanges(true);
    }
  }

  /**
   * to check the user has access to the defined functionality on the page or not.
   *
   * @param path
   */
  public canAccess(path: Array<string> = []) {
    if (this.accessPath.length) {
      return this._rolesFrontService.hasAccessAdminSide(this.accessPath.concat(path));
    }
  }

  public onAddQuestion(event: Event) {
    event.preventDefault();

    if (this._questionToAdd.from && !!this._questionToAdd.value) {
      switch (this._questionToAdd.from) {

        case 'SCRATCH':
          const question = this._missionQuestionService.createQuestion(this._questionToAdd.value.controlType);
          question.identifier = this._questionToAdd.value.identifier;
          const value = {question: question, essential: false};
          this._missionQuestionService.template.sections[this._sectionIndex].questions.push(value);
          this.valueToSave.emit({
            key: 'QUESTION_ADD',
            value: {
              ques: question,
              identifier: question.identifier
            }
          });
          this.notifyChanges();
          this.closeModal();
          break;

        case 'LIBRARY':
          this._missionQuestionService.template.sections[this._sectionIndex].questions = [
            ...this._missionQuestionService.template.sections[this._sectionIndex].questions,
            ...this._questionToAdd.value.map((_value: any) => _value.ques)
          ];
          this.notifyChanges();
          this.closeModal();
          break;

      }
    }
  }

  /**
   * when select the question from the suggestion list in the modal.
   *
   * @param event
   */
  public questionSelected(event: { label: string, question: MissionQuestion }) {
    const questionId = event.question && event.question._id;

    if (!!questionId && MissionFrontService.hasMissionQuestion(this._missionQuestionService.template, (questionId))) {
      this._translateNotificationsService.error('Error', 'The question already exists in the use case.');
    } else if (!!questionId && !this._alreadyInList(questionId)) {
      const value = {
        question: event.question,
        essential: false
      };
      this._questionToAdd.value.push({label: event.label, ques: value});
    }
  }

  /**
   * verify the question exists or not in the list.
   *
   * @param questionId
   * @private
   */
  private _alreadyInList(questionId = ''): boolean {
    if (this._questionToAdd.value && this._questionToAdd.value.length && !!questionId) {
      return this._questionToAdd.value.some((_value: any) => {
        return (_value.ques && _value.ques.question && _value.ques.question._id) === questionId;
      });
    }
    return false;
  }

  /**
   * remove the question from the list when click on the cross btn.
   *
   * @param event
   */
  public onRemoveFromList(event: string) {
    this._questionToAdd.value = this._questionToAdd.value.filter((_value: any) => {
      return (_value.ques && _value.ques.question && _value.ques.question._id) !== event;
    });
  }

  public closeModal() {
    this._showModal = false;
  }

  public onChangeAddQuestion(event: any) {
    this._questionToAdd.from = event;
    this._questionToAdd.value = [];
    this._isAvailableIdentifier = false;

    if (event === 'SCRATCH') {
      this._questionToAdd.value = {
        controlType: '',
        identifier: ''
      };
    }
  }

  public onChangeIdentifier(event: string) {
    event = event.trim();
    this._identifierError = <IdentifierError>{};
    this._questionToAdd.value.identifier = '';
    this._isAvailableIdentifier = false;

    if (!!event.match(/[A-Za-z]/g)) {
      this._questionToAdd.value.identifier = event;
    } else if (event.length) {
      this._identifierError.letter = true;
    }
  }

  public onCheckAvailability(event: Event) {
    event.preventDefault();

    if (!this._isAvailableIdentifier) {
      this._isCheckingAvailability = true;

      const find = MissionFrontService.totalTemplateQuestions(this._missionQuestionService.template).some((_ques) => {
        return _ques['question'].identifier.toLocaleLowerCase() === this._questionToAdd.value.identifier.toLocaleLowerCase();
      });

      if (!find) {
        this._missionService.checkIdentifierAvailability(this._questionToAdd.value.identifier)
          .pipe(first())
          .subscribe((response) => {
            this._isCheckingAvailability = false;
            this._identifierError.exist = !!(response && response.length);
            this._isAvailableIdentifier = !(response && response.length);
          }, (error: HttpErrorResponse) => {
            this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
            this._isCheckingAvailability = false;
            console.error(error);
          });
      } else {
        this._identifierError.exist = true;
        this._isAvailableIdentifier = false;
        this._isCheckingAvailability = false;
      }
    }
  }

}
