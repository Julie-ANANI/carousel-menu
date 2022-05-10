import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { AutocompleteService } from '../../../../../../services/autocomplete/autocomplete.service';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { Preset } from '../../../../../../models/preset';
import { Observable, Subject } from 'rxjs';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { first, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { isPlatformBrowser } from '@angular/common';
import { Mission, MissionCardTitle, MissionTemplate } from '../../../../../../models/mission';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { MissionQuestionService } from "../../../../../../services/mission/mission-question.service";
import { lang, Language } from "../../../../../../models/static-data/language";
import { InnovCard } from "../../../../../../models/innov-card";

@Component({
  templateUrl: './admin-project-questionnaire.component.html',
  styleUrls: ['./admin-project-questionnaire.component.scss']
})

export class AdminProjectQuestionnaireComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _mission: Mission = <Mission>{};

  private _quizLink = '';

  private _showPresetModal = false;

  private _chosenPreset: Preset = <Preset>{};

  private _sectionsNames: Array<string> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _cardsLanguages: Array<Language> = [];

  private _cardsSections: MissionCardTitle = <MissionCardTitle>{};

  private _leftMirrorLanguage: Language = null;

  private _rightMirrorLanguage: Language = null;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _autocompleteService: AutocompleteService,
              private _presetService: PresetService,
              private _rolesFrontService: RolesFrontService,
              private _innovationFrontService: InnovationFrontService,
              private _missionQuestionService: MissionQuestionService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._innovation = this._innovationFrontService.innovation().value;
      this._setQuizLink();

      this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
        if (innovation && innovation._id) {
          this._innovation = innovation;

          this._cardsLanguages = [];

          if (this._innovation.mission && (<Mission>this._innovation.mission)._id) {
            this._mission = <Mission>this._innovation.mission;
          }

          // this._innovation.innovationCards.map((card) => {
          //     this.initialiseCardLanguages(card);
          //   }
          // );

          lang.map(language =>{
            this.initialiseCardLanguages(language);
          })

          this.initialiseMirrorLanguages();

          this._setSectionsNames();

          this._missionQuestionService.questionnaireLangs = this._cardsLanguages;
        }
      });
    }
  }

  /**
   * initialise cardLanguages list
   * @param language
   */
  initialiseCardLanguages(language: any) {
    // const language = lang.find(l => l.type === card.lang);
    if (language) {
      language['hidden'] = true;
      language['status'] = 'EDITING';
      this._cardsLanguages.push(language);
    }
  }

  /**
   * when there are more than 2 languages
   * set two mirror languages or only set left mirror
   */
  initialiseMirrorLanguages() {
    if (this._cardsLanguages.length > 1) {
      this._rightMirrorLanguage = this._cardsLanguages[1];
    }
    this._leftMirrorLanguage = this._cardsLanguages.length && this._cardsLanguages[0] || null;
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'questionnaire'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'questionnaire']);
    }
  }

  private _setQuizLink() {
    this._quizLink = InnovationFrontService.quizLink(this._innovation);
  }

  private _setSectionsNames() {
    this._sectionsNames = [];
    let customSection = false;
    let frenchTitles: Array<string> = [];
    let englishTitles: Array<string> = [];
    this._cardsSections = {
      en: [],
      fr: [],
    };

    this._innovation.innovationCards.forEach(card => {
      if (card.sections) {
        if (this.hasMissionTemplate) {
          this._cardsSections[card.lang] = card.sections.filter((_section) => !!_section.visibility);
        } else {
          if (card.sections.some(section => section.type === 'OTHER')) {
            customSection = true;
          }
          const titles = card.sections.map((s => s.title));
          if (card.lang === 'fr') {
            frenchTitles = titles;
          } else {
            englishTitles = titles;
          }
        }
        this._cardsSections[card.lang].map((s: any, index: number) => {
          s.index = index;
          this._markSectionIndex(s, index);
        });
      }
    });

    if (!this.hasMissionTemplate) {
      const sectionsNb = frenchTitles.length > englishTitles.length ? frenchTitles.length : englishTitles.length;
      if (sectionsNb > 2 || customSection) {
        for (let i = 0; i < sectionsNb; i++) {
          this._sectionsNames.push(`${englishTitles[i] || 'No section'} || ${frenchTitles[i] || 'Pas de section'}`);
        }
      }
    }
  }


  private _markSectionIndex(section: any, index: number) {
    if (section.type === "OTHER") {
      const sectionCardToMark = this._mission.template.sections.find(s => s.identifier === section.title);
      if (sectionCardToMark) {
        sectionCardToMark['index'] = index;
      }
    } else {
      const sectionCardToMark = this._mission.template.sections.find(s => s.type === section.type);
      if (sectionCardToMark) {
        sectionCardToMark['index'] = index;
      }
    }
  }

  private _saveInnovation() {
    this._innovationService.save(this._innovation._id, {preset: this._innovation.preset})
      .pipe(first()).subscribe((_) => {
      this._translateNotificationsService.success('Success', 'The preset is updated.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Project Saving Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  getObjective(lang: string = 'en') {
    const entry = this.mission.template.entry.find(e => e.lang === lang);
    return entry && entry.objective || '';
  }

  /***
   * when the user clicks on the Generate button to generate quiz.
   * @param event
   */
  public generateQuiz(event: Event) {
    event.preventDefault();

    this._innovationService.createQuiz(this._innovation._id).pipe(first()).subscribe((innovation: Innovation) => {
      this._setQuizLink();
      this._translateNotificationsService.success('Success', 'The quiz is generated.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Quiz Generating Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  /***
   * when the user clicks on the Import button, open the modal.
   * @param event
   */
  public openPresetSelection(event: Event) {
    event.preventDefault();
    this._chosenPreset = null;
    this._showPresetModal = true;
  }

  public presetSuggestions = (searchString: string): Observable<Array<{ name: string, domain: string, logo: string }>> => {
    return this._autocompleteService.get({query: searchString, type: 'preset'});
  }

  public autocompletePresetListFormatter = (data: Preset): string => {
    return data.name;
  }

  public choosePreset(event: { name: string, _id: string }) {
    this._chosenPreset = null;
    this._presetService.get(event._id).pipe(first()).subscribe((preset) => {
      this._chosenPreset = preset;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Preset Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  public importPreset(event: Event): void {
    event.preventDefault();
    this._innovation.preset = this._chosenPreset;
    this._saveInnovation();
    this._showPresetModal = false;
  }

  /**
   *
   * @param event
   * @param lang
   * @param mirror: which side
   */
  selectMirrorLanguage(event: Event, lang: Language, mirror: string) {
    event.preventDefault();
    console.log(lang);
    if (mirror === 'right') {
      this._rightMirrorLanguage = lang;
    } else {
      this._leftMirrorLanguage = lang;
    }
  }

  /***
   * when the users makes the changes in the existing preset or template sections.
   * @param event
   * @param type
   */
  public updatePreset(event: Preset | MissionTemplate, type: 'TEMPLATE' | 'PRESET'): void {
    if (this.canAccess(['edit'])) {
      if (type === 'TEMPLATE') {
        this._mission.template = <MissionTemplate>event;
        this._innovation.mission = this._mission;
        this._innovationFrontService.setNotifyChanges({key: 'mission', state: true});
      } else if (type === 'PRESET') {
        this._innovation.preset = <Preset>event;
        this._innovationFrontService.setNotifyChanges({key: 'preset', state: true});
      }
      this._innovationFrontService.setInnovation(this._innovation);
    }
  }

  get hasMissionTemplate(): boolean {
    return this._mission.template && this._mission.template.sections && this._mission.template.sections.length > 0;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get quizLink(): string {
    return this._quizLink;
  }

  get chosenPreset(): Preset {
    return this._chosenPreset;
  }

  get showPresetModal(): boolean {
    return this._showPresetModal;
  }

  set showPresetModal(value: boolean) {
    this._showPresetModal = value;
  }

  get sectionsNames(): Array<string> {
    return this._sectionsNames;
  }

  get cardsLanguages(): Array<Language> {
    return this._cardsLanguages;
  }

  get mission(): Mission {
    return this._mission;
  }

  get cardsSections(): MissionCardTitle {
    return this._cardsSections;
  }

  get leftMirrorLanguage(): Language {
    return this._leftMirrorLanguage;
  }


  set leftMirrorLanguage(value: Language) {
    this._leftMirrorLanguage = value;
    console.log(this._leftMirrorLanguage);
  }

  set rightMirrorLanguage(value: Language) {
    this._rightMirrorLanguage = value;
  }

  get rightMirrorLanguage(): Language {
    return this._rightMirrorLanguage;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }


}
