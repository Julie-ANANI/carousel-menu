import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { AutocompleteService } from '../../../../../../services/autocomplete/autocomplete.service';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { environment } from '../../../../../../../environments/environment';
import { Preset } from '../../../../../../models/preset';
import {Observable, Subject} from 'rxjs';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import {first, takeUntil} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import {isPlatformBrowser} from '@angular/common';
import {Mission, MissionTemplate} from '../../../../../../models/mission';

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

  private _sectionsNames: Array<string>;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _cardsLanguages: Array<string> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _autocompleteService: AutocompleteService,
              private _presetService: PresetService,
              private _rolesFrontService: RolesFrontService,
              private _innovationFrontService: InnovationFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
        this._innovation = innovation || <Innovation>{};
        this._mission = <Mission>this._innovation.mission || <Mission>{};
        this._cardsLanguages = this._innovation.innovationCards.map((card) => card.lang);
        this._setQuizLink();
        this._setSectionsNames();
      });
    }
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'questionnaire'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'questionnaire']);
    }
  }

  private _setQuizLink() {
    if (this._innovation.quizId && Array.isArray(this._innovation.campaigns) && this._innovation.campaigns.length > 0) {
      this._quizLink = `${environment.quizUrl}/quiz/${this._innovation.quizId}/${this._innovation.campaigns[0]._id}` || '';
    }
  }

  private _setSectionsNames() {
    this._sectionsNames = [];
    let customSection = false;
    let frenchTitles: Array<string> = [];
    let englishTitles: Array<string> = [];

    this._innovation.innovationCards.forEach(card => {
      if (card.sections) {
        if (card.sections.some(section => section.type === 'OTHER')) {
          customSection = true;
        }
        const titles = card.sections.map(s => s.title);
        if (card.lang === 'fr') {
          frenchTitles = titles;
        } else {
          englishTitles = titles;
        }
      }
    });

    const sectionsNb = frenchTitles.length > englishTitles.length ? frenchTitles.length : englishTitles.length;
    if (sectionsNb > 2 || customSection) {
      for (let i = 0; i < sectionsNb; i++) {
        this._sectionsNames.push(`${englishTitles[i] || 'No section'} || ${frenchTitles[i] || 'Pas de section'}`);
      }
    }

  }

  private _saveInnovation() {
    this._innovationService.save(this._innovation._id, {preset: this._innovation.preset}).subscribe((innovation: Innovation) => {
      this._innovation = innovation;
      this._setQuizLink();
      this._translateNotificationsService.success('Success', 'The preset is updated.');
    }, (err: HttpErrorResponse) => {
     this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
     console.error(err);
    });
  }

  /***
   * when the user clicks on the Generate button to generate quiz.
   * @param event
   */
  public generateQuiz(event: Event) {
    event.preventDefault();
    this._innovationService.createQuiz(this._innovation._id).pipe(first()).subscribe((innovation: Innovation) => {
      this._innovation = innovation;
      this._innovationFrontService.setInnovation(innovation);
      this._setQuizLink();
      this._translateNotificationsService.success('Success', 'The quiz is generated.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
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

  public presetSuggestions = (searchString: string): Observable<Array<{name: string, domain: string, logo: string}>> => {
    return this._autocompleteService.get({query: searchString, type: 'preset'});
  }

  public autocompletePresetListFormatter = (data: Preset): string => {
    return data.name;
  }

  public choosePreset(event: {name: string, _id: string}) {
    this._chosenPreset = null;
    this._presetService.get(event._id).pipe(first()).subscribe((preset) => {
      this._chosenPreset = preset;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public importPreset(event: Event): void {
    event.preventDefault();
    this._innovation.preset = this._chosenPreset;
    this._saveInnovation();
    this._showPresetModal = false;
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

  get cardsLanguages(): Array<string> {
    return this._cardsLanguages;
  }

  get mission(): Mission {
    return this._mission;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
