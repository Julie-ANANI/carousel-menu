import {Component, Input, OnInit} from '@angular/core';
import {MissionTemplateSection} from '../../../../../models/mission';
import {picto, Picto} from '../../../../../models/static-data/picto';
import {TranslateService} from '@ngx-translate/core';
import {MissionQuestionService} from '../../../../../services/mission/mission-question.service';

@Component({
  selector: 'app-shared-questionnaire-section',
  templateUrl: './shared-questionnaire-section.component.html',
  styleUrls: ['./shared-questionnaire-section.component.scss']
})
export class SharedQuestionnaireSectionComponent implements OnInit {

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
   * can be edit or not.
   */
  @Input() isEditable = false;

  @Input() set sectionIndex(value: number) {
    this._sectionIndex = value;
  }

  @Input() set section(value: MissionTemplateSection) {
    this._section = value || <MissionTemplateSection>{};
    console.log(value);
  }

  private _picto: Picto = picto;

  private _isCollapsed = false;

  private _section: MissionTemplateSection = <MissionTemplateSection>{};

  private _sectionIndex = 0;

  private _editSection = false;

  constructor(private _translateService: TranslateService,
              private _missionQuestionService: MissionQuestionService) { }

  ngOnInit() {
  }

  public addNewQuestion(event: Event) {
    event.preventDefault();
    this._missionQuestionService.addQuestion(this._sectionIndex);
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
    this._missionQuestionService.changeSectionName(value, lang, this._section);
  }

  public notifyChanges() {
    if (this.isEditable) {
      this._missionQuestionService.setNotifyChanges(true);
    }
  }

}
