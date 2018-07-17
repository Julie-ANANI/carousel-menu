import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EmailService } from '../../../../services/email/email.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import {Table} from '../../../shared/components/shared-table/models/table';
import {Template} from '../../../sidebar/interfaces/template';


@Component({
  selector: 'app-shared-email-blacklist',
  templateUrl: 'admin-email-blacklist.component.html',
  styleUrls: ['admin-email-blacklist.component.scss']
})
export class AdminEmailBlacklistComponent implements OnInit {

  private _config = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  private _dataset: {blacklists: Array<any>, _metadata: any};

  private _searchConfiguration = '';
  private _addressToBL = '';

  public editDatum: {[propString: string]: boolean} = {};

  private _tableInfos: Table = null;

  private _more: Template = {};
  private _currentEmailToBlacklist: any = {};

  constructor( private _emailService: EmailService,
               private _translateService: TranslateService,
               private _notificationsService: TranslateNotificationsService) { }

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
        .subscribe(result => {
          if (result && result.message) {
            // The server may be busy...
            this._notificationsService.error('Warning', 'The server is busy, try again in 1 minute.');
          } else {
            this._dataset._metadata = result._metadata;
              this._dataset.blacklists = result.blacklists.map((entry: any) => {
                entry.expiration = new Date(entry.expiration).getTime() ? entry.expiration : '';
                return entry;
              });

            this._tableInfos = {
              _selector: 'shared-blacklist',
              _title: 'COMMON.BLACKLIST',
              _content: this._dataset.blacklists,
              _total: this._dataset._metadata.totalCount,
              _isHeadable: true,
              _isFiltrable: true,
              _isSelectable: true,
              _isEditable: true,
              _columns: [
                {_attrs: ['email'], _name: 'COMMON.EMAIL', _type: 'TEXT'},
                {_attrs: ['created'], _name: 'COMMON.CREATED', _type: 'DATE'},
                {_attrs: ['expiration'], _name: 'COMMON.EXPIRATION', _type: 'DATE'},
                {_attrs: ['reason'], _name: 'COMMON.REASON', _type: 'MULTI-CHOICES',
                  _choices: [
                    {
                      _name: 'MANUALLY_ADDED',
                      _class: 'label-progress'
                    }, {
                      _name: 'USER_SUPPRESSION',
                      _class: 'label-validate'
                    }, {
                      _name: 'PROFESSIONAL_SUPPRESSION',
                      _class: 'label-alert'
                    },
                    {
                      _name: 'MAIL_EVENT',
                      _class: 'label-editing'
                    }
                    ]}]
            };
          }
        }, error => {
          this._notificationsService.error('Error', error);
        });
  }

  public configureSearch() {
    this._config.search['email'] = this.searchConfiguration;
    this.loadData(null);
  }

  public resetSearch() {
    this._config.search = {};
    this.searchConfiguration = '';
    this.loadData(null);
  }

  editBlacklist(email: any) {
    this._currentEmailToBlacklist = this._dataset.blacklists.find(value => value._id === email._id);
      this._more = {
        animate_state: 'active',
        title: 'COMMON.EDIT-BLACKLIST',
        type: 'editBlacklist'
      };
  }

  excludeEmails() {
    this._more = {
      animate_state: 'active',
      title: 'COMMON.EXCLUDE-EMAILS',
      type: 'excludeEmails'
    };
  }

  excludeDomains() {
    this._more = {
      animate_state: 'active',
      title: 'COMMON.EXCLUDE-DOMAINS',
      type: 'excludeDomains'
    };
  }

  excludeCountries() {
    this._more = {
      animate_state: 'active',
      title: 'COMMON.EXCLUDE-COUNTRIES',
      type: 'excludeCountries'
    };
  }

  closeSidebar(value: string) {
    this.more.animate_state = value;
  }

  blacklistEditionFinish(email: any) {
    console.log(email);
    this._emailService.updateBlacklistEntry(email._id, email)
      .first()
      .subscribe(
        data => {
          this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
          this._more = {animate_state: 'inactive', title: this._more.title};
          this.loadData(this._config);
        },
        error => {
          this._notificationsService.error('ERROR.ERROR', error.message);
        });
  }

  addEmailsToBlacklistFinish(emails: Array<string>) {
    emails.forEach((value: any) => {
      this._emailService.addToBlacklist({email: value.text})
        .subscribe(result => {
          this._notificationsService.success('Blacklist', 'ERROR.ACCOUNT.UPDATE');
          this._more = {animate_state: 'inactive', title: this._more.title};
          this.loadData(this._config);
        }, error => {
          this._notificationsService.error('Error', error);
        });
    });
  }

  addDomainsToBlacklistFinish(domains: Array<string>) {
    /*domains.forEach((value: any) => {
      this._emailService.addToBlacklist({domain: value.text})
        .subscribe(result => {
          this._notificationsService.success('Blacklist', 'ERROR.ACCOUNT.UPDATE');
          this._more = {animate_state: 'inactive', title: this._more.title};
          this.loadData(this._config);
        }, error => {
          this._notificationsService.error('Error', error);
        });
    });*/
  }

  public addEntry() {
    this._emailService.addToBlacklist({email: this.addressToBL})
        .subscribe(result => {
          this.addressToBL = '';
          this.resetSearch();
          this._notificationsService.success('Blacklist', `The address ${this.addressToBL} has been added successfully to the blacklist`);
        }, error => {
          this._notificationsService.error('Error', error);
        });
  }

  public updateEntry(datum: any, event: Event) {
    event.preventDefault();
    this.editDatum[datum._id] = false;
    this._emailService.updateBlacklistEntry(datum._id, datum)
        .subscribe(result => {
          this.resetSearch();
          this._notificationsService.success('Blacklist', `The address ${this.addressToBL} has been updated`);
        }, error => {
          this._notificationsService.error('Error', error);
        });
  }

  public canAdd(): boolean {
    const EMAIL_REGEXP = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
    return this.addressToBL !== '' && !!this.addressToBL.match(EMAIL_REGEXP);
  }

  public reasonFormat(datum: any): string {
    let result = '';
    switch (datum.reason || '') {
      case( 'USER_SUPPRESSION' ):
        result = 'Deleted user';
        break;
      case('PROFESSIONAL_SUPPRESSION'):
          result = 'Deleted professional';
        break;
      case('MAIL_EVENT'):
        result = 'Unsubscribe event';
        break;
      case('MANUALLY_ADDED'):
      default:
        result = 'Added by operator';
    }
    return result;
  }

  get tableInfos(): Table { return this._tableInfos; }
  get data(): Array<any> { return this._dataset.blacklists; };
  get metadata(): any { return this._dataset._metadata; };
  get config(): any { return this._config; };
  set config(value: any) { this._config = value; };
  get total(): number { return this._dataset._metadata.totalCount; };
  get searchConfiguration(): string { return this._searchConfiguration; };
  get addressToBL(): string { return this._addressToBL; };
  get more(): Template { return this._more; }
  get currentEmailToBlacklist(): any { return this._currentEmailToBlacklist; }
  set searchConfiguration(value: string) { this._searchConfiguration = value; };
  set addressToBL(address: string ) { this._addressToBL = address; };
}
