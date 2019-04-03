import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { countries } from '../../../../../../../../models/static-data/country';
//import { TagsService } from '../../../../../../../../services/tags/tags.service';
import { TranslateService } from '@ngx-translate/core';
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

  private _targetCountries = ['CO'];

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

}

