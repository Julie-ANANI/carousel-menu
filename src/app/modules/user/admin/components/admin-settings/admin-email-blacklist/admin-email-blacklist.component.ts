import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {Subject} from 'rxjs';
import {SidebarInterface} from '../../../../../sidebars/interfaces/sidebar-interface';
import {TranslateNotificationsService} from '../../../../../../services/translate-notifications/translate-notifications.service';
import {EmailService} from '../../../../../../services/email/email.service';
import {isPlatformBrowser} from '@angular/common';
import {first, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {domainRegEx} from '../../../../../../utils/regex';
import { Table, Config } from '@umius/umi-common-component/models';

@Component({
  templateUrl: 'admin-email-blacklist.component.html',
})

export class AdminEmailBlacklistComponent implements OnInit, OnDestroy {

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _emailDataset: {blacklists: Array<any>, _metadata: any} = {
    blacklists: [],
    _metadata: {
      totalCount: -1
    }
  };

  private _tableInfos: Table = <Table>{};

  private _currentEmailToBlacklist: any = {};

  private _isLoading = true;

  private _fetchingError = false;

  private _sidebarValue = <SidebarInterface>{};

  private _isEditable = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _emailService: EmailService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      this._initTable();
      this._getBlacklist(this._config);
    }
  }

  private _getBlacklist(config: Config) {
    this._config = config || this._config;

    this._emailService.getBlacklist(this._config).pipe(first()).subscribe((result: any) => {
      if (result && result.message) {
        // The server may be busy...
        this._translateNotificationsService.error('Warning', 'The server is busy, try again in 1 minute.');
      } else {
        this._emailDataset._metadata = result._metadata;
          this._emailDataset.blacklists = result.blacklists.map((entry: any) => {
            entry.expiration = new Date(entry.expiration).getTime() ? entry.expiration : '';
            return entry;
          });
        this._initTable();
      }
    }, (error: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
      console.error(error);
      this._fetchingError = true;
    });

  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'blocklist'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'blocklist']);
    }
  }

  private _initTable() {
    this._tableInfos = {
      _selector: 'admin-blacklisted-emails',
      _title: 'Blacklisted e-mails / domains',
      _content: this._emailDataset.blacklists,
      _total: this._emailDataset._metadata.totalCount,
      _isTitle: true,
      _isSearchable: !!this.canAccess(['searchBy']) || !!this.canAccess(['sortBy']),
      _isPaginable: this._emailDataset._metadata.totalCount > 10,
      _clickIndex: this.canAccess(['view']) || this.canAccess(['edit']) ? 1 : null,
      _columns: [
        {
          _attrs: ['email'],
          _name: 'E-mail Address',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'emailAddress']),
          _isHidden: !this.canAccess(['tableColumns', 'emailAddress'])
        },
        {
          _attrs: ['domain'],
          _name: 'Domain',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'domain']),
          _isHidden: !this.canAccess(['tableColumns', 'domain'])
        },
        {
          _attrs: ['created'],
          _name: 'Created On',
          _type: 'DATE',
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'created'])
        },
        {
          _attrs: ['expiration'],
          _name: 'Expires On',
          _type: 'DATE',
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'expires'])
        },
        {
          _attrs: ['reason'],
          _name: 'Reason',
          _type: 'MULTI-CHOICES',
          _isSearchable: this.canAccess(['sortBy', 'reason']),
          _isHidden: !this.canAccess(['tableColumns', 'reason']),
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
        {
          _attrs: ['type'],
          _name: 'Type',
          _type: 'MULTI-CHOICES',
          _isSearchable: this.canAccess(['sortBy', 'type']),
          _isHidden: !this.canAccess(['tableColumns', 'type']),
          _choices: [
            {_name: 'EMAIL', _alias: 'COMMON.LABEL.EMAIL', _class: 'label is-draft'},
            {_name: 'GLOBAL', _alias: 'COMMON.DOMAIN', _class: 'label is-secondary'}
          ]}]
    };
  }

  public editBlacklist(email: any) {
    this._currentEmailToBlacklist = this._emailDataset.blacklists.find(value => value._id === email._id);
    this._isEditable = this.canAccess(['edit']);
    this._sidebarValue = {
      animate_state: 'active',
      title: this._isEditable ? 'Edit Blacklisted E-mail' : 'Blacklisted E-mail',
      type: 'EDIT_EMAILS'
    };
  }

  public excludeSidebar(event: Event) {
    event.preventDefault();
    this._isEditable = this.canAccess(['add']);
    this._sidebarValue = {
      animate_state: 'active',
      title: 'Exclude E-mails / Domains',
      type: 'EXCLUDE_EMAILS_DOMAINS'
    };
  }

  public blacklistEditionFinish(email: any) {
    this._emailService.updateBlacklistEntry(email._id, email).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('Success', 'The E-mail information is updated.');
      this._getBlacklist(this._config);
      },
      (error: HttpErrorResponse) => {
      this._translateNotificationsService.error('Error', error.message);
      console.error(error);
    });
  }

  public toBlacklists(values: {emails: Array<string>, domains: Array<string>}) {
    if (values.emails && values.emails.length) {
      this._addToBlacklist(values.emails);
    }
    if (values.domains && values.domains.length) {
      this._addToBlacklist(values.domains, 'DOMAIN');
    }
  }

  private _addToBlacklist(values: Array<any>, type: 'EMAIL' | 'DOMAIN' = 'EMAIL') {
    for (let i = 0; i < values.length; i++) {
      let _text = type === 'DOMAIN' ? `${values[i].name}` : values[i].text;

      if (!!values[i].domain) {
        _text = `*@${values[i].domain}`;
      }

      if ((type === 'DOMAIN' && domainRegEx.test(_text) || type === 'EMAIL')) {
        this._emailService.addToBlacklist({email: _text}).pipe(takeUntil(this._ngUnsubscribe)).subscribe(() => {
          this._refreshList(i, values.length - 1);
          this._translateNotificationsService.success('Success',
            `The address ${_text} will be added to the blacklist. It will take sometime to get reflected.`);
        }, (error: HttpErrorResponse) => {
          this._refreshList(i, values.length - 1);
          this._translateNotificationsService.error('Error', error.message);
          console.error(error);
        });
      } else if (type === 'DOMAIN' && !domainRegEx.test(_text)) {
        this._translateNotificationsService.success('Error', `The domain ${_text} format is not correct.`);
      }

    }
  }

  private _refreshList(index: number, total: number) {
    if (index === total) {
      this._getBlacklist(this._config);
    }
  }

  public reasonFormat(reason: string): string {
    switch (reason || '') {

      case( 'USER_SUPPRESSION' ):
        return 'Deleted user';

      case('PROFESSIONAL_SUPPRESSION'):
        return 'Deleted professional';

      case('MAIL_EVENT'):
        return  'Unsubscribe event';

      case('MANUALLY_ADDED'):
      default:
        return 'Added by operator';

    }
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get data(): Array<any> {
    return this._emailDataset.blacklists;
  };

  get metadata(): any {
    return this._emailDataset._metadata;
  };

  get config(): any {
    return this._config;
  };

  set config(value: any) {
    this._config = value;
    this._getBlacklist(this._config);
  };

  get total(): number {
    return this._emailDataset._metadata.totalCount;
  };

  get currentEmailToBlacklist(): any {
    return this._currentEmailToBlacklist;
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
