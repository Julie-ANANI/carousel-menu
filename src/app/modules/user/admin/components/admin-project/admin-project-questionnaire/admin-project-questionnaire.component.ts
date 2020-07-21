import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutocompleteService } from '../../../../../../services/autocomplete/autocomplete.service';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { environment } from '../../../../../../../environments/environment';
import { Preset } from '../../../../../../models/preset';
import { Observable } from 'rxjs';
import { TranslateTitleService } from "../../../../../../services/title/title.service";
import { RolesFrontService } from "../../../../../../services/roles/roles-front.service";
import { first } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorFrontService } from "../../../../../../services/error/error-front.service";

@Component({
  templateUrl: './admin-project-questionnaire.component.html',
  styleUrls: ['./admin-project-questionnaire.component.scss']
})

export class AdminProjectQuestionnaireComponent implements OnInit {

  private _innovation: Innovation = <Innovation>{};

  private _quizLink = '';

  private _showPresetModal = false;

  private _chosenPreset: Preset = <Preset>{};

  constructor(private _activatedRoute: ActivatedRoute,
              private _autocompleteService: AutocompleteService,
              private _presetService: PresetService,
              private _rolesFrontService: RolesFrontService,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService) {

    this._setPageTitle();
  }

  ngOnInit(): void {
    if (this._activatedRoute.snapshot.parent.data['innovation']
      && typeof this._activatedRoute.snapshot.parent.data['innovation'] !== undefined) {
      this._innovation = this._activatedRoute.snapshot.parent.data['innovation'];
      this._setPageTitle(this._innovation.name);
      this._setQuizLink();
    }
  }

  private _setPageTitle(title?: string) {
    if (title) {
      this._translateTitleService.setTitle('Questionnaire | ' + title);
    } else {
      this._translateTitleService.setTitle('Questionnaire');
    }
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'questionnaire'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'questionnaire']);
    }
  }

  _updateProject(innovation: Innovation) {
    this._innovation = innovation;
  }

  private _setQuizLink() {
    if (this._innovation.quizId && Array.isArray(this._innovation.campaigns) && this._innovation.campaigns.length > 0) {
      this._quizLink = `${environment.quizUrl}/quiz/${this._innovation.quizId}/${this._innovation.campaigns[0]._id}` || '';
    }
  }

  private _saveInnovation() {
   this._innovationService.save(this._innovation._id, this._innovation).subscribe((innovation: Innovation) => {
      this._innovation = innovation;
      this._setQuizLink();
      this._translateNotificationsService.success('Success', 'The preset is updated successfully.');
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
      this._setQuizLink();
      this._translateNotificationsService.success('Success', 'The quiz is generated successfully.');
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
  };

  public autocompletePresetListFormatter = (data: Preset): string => {
    return data.name;
  };

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
   * when the users updates the existing preset.
   * @param preset
   */
  public updatePreset(preset: Preset): void {
    if (this.canAccess(['edit'])) {
      this._saveInnovation();
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(403));
    }
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

}
