import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EmailService } from './../../../../services/email/email.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';


@Component({
  selector: 'app-shared-email-blacklist',
  templateUrl: 'shared-email-blacklist.component.html',
  styleUrls: ['shared-email-blacklist.component.scss']
})
export class SharedEmailBlacklistComponent implements OnInit {

  private _config = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  private _dataset: {blacklists: Array<any>, _metadata:any};

  public searchConfiguration = "";
  public addEmail = "";

  constructor( private _emailService: EmailService,
               private _translateService: TranslateService,
               private _notificationsService: TranslateNotificationsService,) { }

  ngOnInit() {
    this._dataset = {
      blacklists: [],
      _metadata: {
        totalCount: 0
      }
    };
    this.loadData(null);
    console.log(this._translateService);
  }

  public loadData(config: any) {
    this._config = config || this._config;
    this._emailService.getBlacklist(this._config)
        .subscribe(result=>{
          if(result && result.message) {
            //The server may be busy...
            this._notificationsService.error("Warning", "The server is busy, try again in 1 minute.");
          } else {
            this._dataset = result;
          }
        }, error=>{
          this._notificationsService.error("Error", error);
        });
  }

  public configureSearch() {
    this._config.search['email'] = this.searchConfiguration;
    this.loadData(null);
  }

  public resetSearch() {
    this._config.search = {};
    this.searchConfiguration = "";
    this.loadData(null);
  }

  public addEntry() {
    this._emailService.addToBlacklist({email:this.addEmail})
        .subscribe(result=>{
          this.addEmail = "";
          this.resetSearch();
          this._notificationsService.success("Blacklist", `The adsress ${this.addEmail} has been added successfully to the blacklist`);
        }, error=>{
          this._notificationsService.error("Error", error);
        });
  }

  public canAdd(): boolean {
    const EMAIL_REGEXP = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
    return this.addEmail !== "" && !!this.addEmail.match(EMAIL_REGEXP);
  }

  get data(): Array<any> { return this._dataset.blacklists; };
  get metadata(): any { return this._dataset._metadata; };
  get config(): any { return this._config; };
  set config(value: any) { this._config = value; };
  get total(): number { return this._dataset._metadata.totalCount; };
}
