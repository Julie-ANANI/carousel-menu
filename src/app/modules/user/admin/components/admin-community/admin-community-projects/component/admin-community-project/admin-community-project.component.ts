import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarInterface } from "../../../../../../../sidebar/interfaces/sidebar-interface";
import { Innovation } from '../../../../../../../../models/innovation';
import { TranslateNotificationsService } from "../../../../../../../../services/notifications/notifications.service";

@Component({
  selector: 'admin-community-project',
  templateUrl: './admin-community-project.component.html',
  styleUrls: ['./admin-community-project.component.scss']
})

export class AdminCommunityProjectComponent {

  private _innovation: Innovation;

  private _config = {};

  private _context: any = null;

  private _sideConfig: any = null;

  private _targetCountries = ['CO'];

  private _sidebarStatus: SidebarInterface = {};

  private _totalThreshold: number;

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._innovation = this._activatedRoute.snapshot.data['innovation'];
    this._context = {
      innovationId: this._innovation._id.toString()
    };
    this._setConfig();

  }


  private _setConfig() {
    this._config = {
      fields: 'firstName lastName tags.label country answers.innovation answers.status ambassador.industry',
      limit: '10',
      offset: '0',
      innovations: this._innovation._id,
      search: '',
      sort: '{ "created": -1 }'
    };
  }


  public checkThreshold(): string {
    return this._totalThreshold > 20 ? '#4F5D6B' : '#EA5858';
  }


  public onClickAddManually(event: Event) {
    this._sidebarStatus = {
      size: "726px",
      type: "addToProject",
      title: "Add Manually",
      animate_state: this._sidebarStatus.animate_state === 'active' ? 'inactive' : 'active',
    };
  }

  public onClickSuggestion(event: Event) {
    this._sidebarStatus = {
      size: "726px",
      type: "addFromSuggestions",
      title: "See Suggestions",
      animate_state: this._sidebarStatus.animate_state === 'active' ? 'inactive' : 'active',
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
    this._sidebarStatus.animate_state = 'inactive';
  }

  get sidebarStatus(): SidebarInterface {
    return this._sidebarStatus;
  }

  set sidebarStatus(_value: SidebarInterface) {
    this._sidebarStatus = _value;
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
}

