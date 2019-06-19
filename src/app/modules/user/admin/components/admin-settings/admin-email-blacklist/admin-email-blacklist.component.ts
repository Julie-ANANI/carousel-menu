import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import {Table} from '../../../../../table/models/table';
import {SidebarInterface} from '../../../../../sidebar/interfaces/sidebar-interface';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {EmailService} from '../../../../../../services/email/email.service';


@Component({
  selector: 'app-shared-email-blacklist',
  templateUrl: 'admin-email-blacklist.component.html',
  styleUrls: ['admin-email-blacklist.component.scss']
})
export class AdminEmailBlacklistComponent implements OnInit {

  private _config = {
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _emailDataset: {blacklists: Array<any>, _metadata: any};

  private _searchConfiguration = '';
  private _addressToBL = '';

  public editDatum: {[propString: string]: boolean} = {};

  private _emailInfos: Table = null;

  private _more: SidebarInterface = {};
  sidebarState = new Subject<string>();
  private _currentEmailToBlacklist: any = {};

  constructor( private _emailService: EmailService,
               private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._emailDataset = {
      blacklists: [],
      _metadata: {
        totalCount: 0
      }
    };

    this.loadEmails(null);

  }

  public loadEmails(config: any) {
    this._config = config || this._config;
    this._emailService.getBlacklist(this._config)
        .subscribe((result: any) => {
          if (result && result.message) {
            // The server may be busy...
            this._notificationsService.error('Warning', 'The server is busy, try again in 1 minute.');
          } else {
            this._emailDataset._metadata = result._metadata;
              this._emailDataset.blacklists = result.blacklists.map((entry: any) => {
                entry.expiration = new Date(entry.expiration).getTime() ? entry.expiration : '';
                return entry;
              });

            this._emailInfos = {
              _selector: 'shared-blacklisted-emails',
              _title: 'COMMON.BLACKLIST.EMAILS',
              _content: this._emailDataset.blacklists,
              _total: this._emailDataset._metadata.totalCount,
              _isSearchable: true,
              _isSelectable: true,
              _isEditable: true,
              _columns: [
                {_attrs: ['email'], _name: 'COMMON.LABEL.EMAIL', _type: 'TEXT'},
                {_attrs: ['created'], _name: 'COMMON.CREATED', _type: 'DATE'},
                {_attrs: ['expiration'], _name: 'COMMON.EXPIRATION', _type: 'DATE'},
                {_attrs: ['reason'], _name: 'COMMON.REASON', _type: 'MULTI-CHOICES',
                  _choices: [
                    {
                      _name: 'MANUALLY_ADDED',
                      _alias: this.reasonFormat('MANUALLY_ADDED'),
                    }, {
                      _name: 'USER_SUPPRESSION',
                      _alias: this.reasonFormat('USER_SUPPRESSION'),
                    }, {
                      _name: 'PROFESSIONAL_SUPPRESSION',
                      _alias: this.reasonFormat('PROFESSIONAL_SUPPRESSION'),
                    },
                    {
                      _name: 'MAIL_EVENT',
                      _alias: this.reasonFormat('MAIL_EVENT'),
                    }
                    ]},
                {_attrs: ['type'], _name: 'COMMON.LABEL.TYPE', _type: 'MULTI-CHOICES',
                  _choices: [
                    {_name: 'EMAIL', _alias: 'COMMON.LABEL.EMAIL', _class: 'label label-draft'},
                    {_name: 'GLOBAL', _alias: 'COMMON.DOMAIN', _class: 'label label-edit'}
                  ]}]
            };
          }
        }, (error: any) => {
          this._notificationsService.error('Error', error);
        });
  }

  public configureSearch() {
    this._config.search['email'] = this.searchConfiguration;
    this.loadEmails(null);
  }

  public resetSearch() {
    this.searchConfiguration = '';
    this.loadEmails(null);
  }

  editBlacklist(email: any) {
    this._currentEmailToBlacklist = this._emailDataset.blacklists.find(value => value._id === email._id);
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

    this._emailDataset.blacklists.forEach(value => {this._emailService.updateBlacklistEntry(value._id, value)
      .subscribe((result: any) => {
      }, (error: any) => {
        this._notificationsService.error('Error', error.message);
      }); });
  }

  closeSidebar(value: string) {
    this.more.animate_state = value;
    this.sidebarState.next(this.more.animate_state);
  }

  blacklistEditionFinish(email: any) {
    console.log(email);
    this._emailService.updateBlacklistEntry(email._id, email)
      .subscribe(
        (data: any) => {
          this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
          this._more = {animate_state: 'inactive', title: this._more.title};
          this.loadEmails(this._config);
        },
        (error: any) => {
          this._notificationsService.error('ERROR.ERROR', error.message);
        });
  }

  addEmailsToBlacklistFinish(emails: Array<string>) {
    emails.forEach((value: any) => {
      this._emailService.addToBlacklist({email: value.text})
        .subscribe((result: any) => {
          this._notificationsService.success('Blacklist', `The address ${value.text} has been added successfully to the blacklist`);
          this._more = {animate_state: 'inactive', title: this._more.title};
          this.loadEmails(this._config);
        }, (error: any) => {
          this._notificationsService.error('Error', error.message);
        });
    });
  }

  public updateEntry(datum: any, event: Event) {
    event.preventDefault();
    this.editDatum[datum._id] = false;
    this._emailService.updateBlacklistEntry(datum._id, datum)
        .subscribe((result: any) => {
          this.resetSearch();
          this._notificationsService.success('Blacklist', `The address ${this.addressToBL} has been updated`);
        }, (error: any) => {
          this._notificationsService.error('Error', error.message);
        });
  }

  public reasonFormat(reason: string): string {
    let result = '';
    switch (reason || '') {
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

  get emailInfos(): Table { return this._emailInfos; }
  get data(): Array<any> { return this._emailDataset.blacklists; };
  get metadata(): any { return this._emailDataset._metadata; };
  get config(): any { return this._config; };
  set config(value: any) { this._config = value; };
  get total(): number { return this._emailDataset._metadata.totalCount; };
  get searchConfiguration(): string { return this._searchConfiguration; };
  get addressToBL(): string { return this._addressToBL; };
  get more(): SidebarInterface { return this._more; }
  get currentEmailToBlacklist(): any { return this._currentEmailToBlacklist; }
  set searchConfiguration(value: string) { this._searchConfiguration = value; };
  set addressToBL(address: string ) { this._addressToBL = address; };
}
