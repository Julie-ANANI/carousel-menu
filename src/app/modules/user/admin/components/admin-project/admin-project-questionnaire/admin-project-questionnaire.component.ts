import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutocompleteService } from '../../../../../../services/autocomplete/autocomplete.service';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { environment } from '../../../../../../../environments/environment';
import { Preset } from '../../../../../../models/preset';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-project-questionnaire',
  templateUrl: './admin-project-questionnaire.component.html',
  styleUrls: ['./admin-project-questionnaire.component.scss']
})

export class AdminProjectQuestionnaireComponent {

  private _innovation: Innovation;

  private _quizLink: string;

  public showPresetModal: boolean;
  private _chosenPreset: Preset;

  constructor(private _activatedRoute: ActivatedRoute,
              private _autocompleteService: AutocompleteService,
              private _presetService: PresetService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService) {

    if (this._activatedRoute.snapshot.parent.data['innovation']) {
      this._innovation = this._activatedRoute.snapshot.parent.data['innovation'];
      this._setQuizLink();
    }

  }

  private _setQuizLink() {
    if (this._innovation && this._innovation.quizId && Array.isArray(this._innovation.campaigns) && this._innovation.campaigns.length > 0) {
      this._quizLink = `${environment.quizUrl}/quiz/${this._innovation.quizId}/${this._innovation.campaigns[0]._id}` || '';
    }
  }

  public saveInnovation() {
   this._innovationService.save(this._innovation._id, this._innovation).subscribe((response: Innovation) => {
      this._innovation = response;
      this._setQuizLink();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PRESET.UPDATED');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  public generateQuiz(event: Event) {
    event.preventDefault();
    this._innovationService.createQuiz(this._innovation._id).subscribe((result: any) => {
      this._innovation = result;
      this._setQuizLink();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.QUIZ.GENERATED');
    }, (err: any) => {
      this._translateNotificationsService.error('ERROR.ERROR', err.message);
    });
  }

  public openPresetSelection(event: Event) {
    event.preventDefault();
    this._chosenPreset = null;
    this.showPresetModal = true;
  }

  public presetSuggestions = (searchString: string): Observable<Array<{name: string, domain: string, logo: string}>> => {
    return this._autocompleteService.get({query: searchString, type: 'preset'});
  };

  public autocompletePresetListFormatter = (data: Preset): string => {
    return data.name;
  };

  public choosePreset(event: {name: string, _id: string}) {
    this._chosenPreset = null;
    this._presetService.get(event._id).subscribe((preset) => {
      this._chosenPreset = preset;
    }, (err) => {
      this._translateNotificationsService.error('ERROR.ERROR', err.message);
    });
  }

  public importPreset(event: Event): void {
    event.preventDefault();
    this._innovation.preset = this._chosenPreset;
    this.showPresetModal = false;
  }

  public savePreset(_preset: Preset): void {
    this.saveInnovation();
  }

  get isVisible(): boolean {
    return !environment.production;
  }

  get innovation() {
    return this._innovation;
  }

  get quizLink() {
    return this._quizLink;
  }

  get chosenPreset() {
    return this._chosenPreset;
  }

}
