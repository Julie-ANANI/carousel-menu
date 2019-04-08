import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarInterface } from "../../../../../../../sidebar/interfaces/sidebar-interface";
import { Innovation } from '../../../../../../../../models/innovation';

@Component({
  selector: 'admin-community-project',
  templateUrl: './admin-community-project.component.html',
  styleUrls: ['./admin-community-project.component.scss']
})

export class AdminCommunityProjectComponent {

  private _innovation: Innovation;

  private _config = {};

  private _sideConfig: any = null;

  private _targetCountries = ['CO'];

  private _sidebarStatus: SidebarInterface = {};

  constructor(private _activatedRoute: ActivatedRoute) {

    this._innovation = this._activatedRoute.snapshot.data['innovation'];
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


  public checkThreshold(value: number): string {
    return value > 20 ? '#4F5D6B' : '#EA5858';
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

}

