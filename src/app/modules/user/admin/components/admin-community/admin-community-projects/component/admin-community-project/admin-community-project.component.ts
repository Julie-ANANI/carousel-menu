import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { countries } from '../../../../../../../../models/static-data/country';
//import { TagsService } from '../../../../../../../../services/tags/tags.service';
import { TranslateService } from '@ngx-translate/core';
import {SidebarInterface} from "../../../../../../../sidebar/interfaces/sidebar-interface";
//import { InnovationService } from '../../../../../../../../services/innovation/innovation.service';
//import { Innovation } from '../../../../../../../../models/innovation';

@Component({
  selector: 'admin-community-project',
  templateUrl: './admin-community-project.component.html',
  styleUrls: ['./admin-community-project.component.scss']
})

export class AdminCommunityProjectComponent implements OnInit {

  private _innovation: any;

  private _config = {};

  private _sideConfig: any = null;

  private _targetCountries = ['CO'];

  private _sidebarStatus: SidebarInterface = {};

  constructor(private activatedRoute: ActivatedRoute,
              private translateService: TranslateService) { }

  ngOnInit() {
    this._innovation = this.activatedRoute.snapshot.data['innovation'];
    this._config = {
      fields: 'firstName lastName tags.label country answers.innovation answers.status ambassador.industry',
      limit: '10',
      offset: '0',
      innovations: this._innovation._id,
      search: '',
      sort: '{"created":-1}'
    };
    console.log(this._config);
    /*this.getAllTags();
    this.initializeVariables();
    this.getAllInnovations();*/
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


  /***
   * checking the browser lang to get the tag label of same lang.
   */
  browserLang(): string {
    return this.translateService.getBrowserLang() || 'en';
  }

  /***
   * to save the changes in professional object to the server.
   */
  onClickSave() {
  }


  /***
   * to notify the user if they perform any update in the professional object.
   */
  notifyChanges() {

  }

  public onClickAddManually(event: Event) {
    /*this._sideConfig = {
      fields: 'firstName lastName tags.label country answers.innovation answers.status ambassador.industry',
      limit: '10',
      offset: '0',
      search: '',
      "$text": `{ $search: ${event} }`,
      sort: '{"created":-1}'
    };*/
    this._sidebarStatus = {
      size: "65%",
      type: "addToProject",
      title: "Add manually",
      animate_state: this._sidebarStatus.animate_state === 'active' ? 'inactive' : 'active',
    };
    console.log(event);
  }

  public onClickSuggestion(event: Event) {
    console.log(event);
    this._sidebarStatus = {
      size: "65%",
      type: "addFromSuggestions",
      title: "See suggestions",
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

}

