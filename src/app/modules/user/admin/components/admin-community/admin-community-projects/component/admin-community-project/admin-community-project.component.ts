import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarInterface } from "../../../../../../../sidebar/interfaces/sidebar-interface";
import { Innovation } from '../../../../../../../../models/innovation';
import { TranslateNotificationsService } from "../../../../../../../../services/notifications/notifications.service";
import { TranslateTitleService } from '../../../../../../../../services/title/title.service';
import { AnswerService } from '../../../../../../../../services/answer/answer.service';

@Component({
  selector: 'admin-community-project',
  templateUrl: './admin-community-project.component.html',
  styleUrls: ['./admin-community-project.component.scss']
})

export class AdminCommunityProjectComponent {

  private _innovation: Innovation;

  private _config: any = {
    fields: 'firstName lastName tags.label country answers.innovation answers.status ambassador.industry',
    limit: '10',
    offset: '0',
    innovations: '',
    search: '',
    sort: '{ "created": -1 }'
  };

  private _context: any = null;

  private _sideConfig: any = null;

  private _targetCountries: Array<string> = [];

  private _sidebarValue: SidebarInterface = {};

  private _totalThreshold: number;

  private _fetchingError: boolean;

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateTitleService: TranslateTitleService,
              private _answerService: AnswerService,
              private _translateNotificationsService: TranslateNotificationsService) {

    if (typeof (this._activatedRoute.snapshot.data['innovation']) !== 'undefined') {
      this._innovation = this._activatedRoute.snapshot.data['innovation'];
      this._translateTitleService.setTitle(`${this._innovation.name}`);
      this._config.innovations = this._innovation._id;
      this._getTargetedCountries();

      this._context = {
        innovationId: this._innovation._id.toString()
      };

    } else {
      this._fetchingError = true;
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    }

  }


  private _getTargetedCountries() {
    this._answerService.getInnovationValidAnswers(this._innovation._id).subscribe((response) => {
      if (response && response.answers) {
        this._targetCountries = response.answers.reduce((acc, answer) => {
          if (acc.indexOf(answer.country.flag) === -1) {
            acc.push(answer.country.flag);
          }
          return acc;
        }, []);
      }
    });
  }


  public checkThreshold(): string {
    return this._totalThreshold > 20 ? '#4F5D6B' : '#EA5858';
  }


  public onClickAddManually(event: Event) {
    event.preventDefault();

    this._sidebarValue = {
      size: "850px",
      type: "addToProject",
      title: "Add Ambassador",
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
    };

  }


  public onClickSuggestion(event: Event) {
    event.preventDefault();

    this._sidebarValue = {
      size: "850px",
      type: "addFromSuggestions",
      title: "Ambassadors Suggestions",
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
    };

  }


  public actionsResultCallback(response: Event) {
    if(!!response) {
      if(response['result'].status === 'error') {
        this._translateNotificationsService.error('ERROR.ERROR', response['result'].message);
      } else {
        const message = `Operation done!`; // TODO Use a real informative message
        this._translateNotificationsService.success('ERROR.SUCCESS', message);
      }
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', "Empty result");
    }
    this._sidebarValue.animate_state = 'inactive';
  }


  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get sideConfig(): any {
    return this._sideConfig;
  }

  get innovation() {
    return this._innovation;
  }

  get config() {
    return this._config;
  }

  get targetCountries() {
    return this._targetCountries;
  }

  get totalThreshold(): number {
    return this._totalThreshold;
  }

  get context() {
    return this._context;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

}

