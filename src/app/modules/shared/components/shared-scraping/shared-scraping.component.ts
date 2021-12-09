import {Component, Input, OnInit} from '@angular/core';
import {RolesFrontService} from '../../../../services/roles/roles-front.service';
import {ScrapingService} from '../../../../services/scraping/scraping.service';
import {SidebarInterface} from '../../../sidebars/interfaces/sidebar-interface';
import {TranslateNotificationsService} from '../../../../services/translate-notifications/translate-notifications.service';

@Component({
  selector: 'app-shared-scraping',
  templateUrl: './shared-scraping.component.html',
  styleUrls: ['./shared-scraping.component.scss']
})
export class SharedScrapingComponent implements OnInit {

  @Input() accessPath: Array<string> = [];

  private _params: any = null;

  private _showResultScraping = false;

  private _showKeepInformed = false;

  private _result: any = null;

  private _attributes: Array<string> = [];

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  private _keepInformed = 'Starting a crawling';

  private _isScraping = false;

  private _isError = false;

  private _isWarning = false;

  private _error = '';

  private _warning = '';

  private _refreshIntervalId: any = null;

  private _isCancel = false;

  private _runningScrapings: Array<{id: string, url: string}> = [];

  constructor(private _rolesFrontService: RolesFrontService,
              private _scrapingService: ScrapingService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit(): void {
    this._initParams();
  }

  private _initParams() {
    this._scrapingService.getRunningScrapings().subscribe(runningScrapings => {
      this._runningScrapings = runningScrapings;
    });
    this._params = {
      url: '',
      rawData: false,
      // formattedAddress: false,
      // whereFormattedAddress: '',
      dynamicHTML: false,
      loadMore: '',
      skipMails: '',
      numberSpecificData: 0,
      specificData: [{}, {}, {}, {}, {}],
      isCatalog: false,
      isSpider: false,
      numberFields: 0,
      fields: [{}, {}, {}, {}, {}],
      isDeep: false,
      crawlDeeperOn: '',
      id: Math.floor(Math.random() * 1000000)
    };
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(
      this.accessPath.concat(path)
    );
  }

  public onClickImport(file: File) {
    this._isScraping = true;
    this._isError = false;
    this._isWarning = false;
    this._translateNotificationsService.success(
      'Success',
      'The file is imported'
    );
    this._scrapingService.scrapePdf(file).subscribe(
      (value) => {
        this._isScraping = false;
        this._result = value;
        if ('error' in this._result) {
          this._isError = true;
          this._error = this._result['error'];
        } else {
          this._isError = false;
          if ('warning' in this._result) {
            this._isWarning = true;
            this._warning = this._result['warning'];
          } else {
            this._isWarning = false;
          }
          this.updateAttributes();
        }
      },
      (error) => {
        this._translateNotificationsService.error('Uh-oh, an error occurred!', error);
      },
      () => {
        this.stopKeepInformed();
      });
  }


  onClickSearch(): void {
    this._showResultScraping = false;
    this._showKeepInformed = true;
    this._isScraping = true;
    this._isError = false;
    this._isWarning = false;
    const scrapeParams = this._params;
    this.startKeepInformed();
    this._scrapingService.getScraping(scrapeParams).subscribe(
      (value) => {
        this._showKeepInformed = false;
        this._isScraping = false;
        this._result = value;
        if ('error' in this._result) {
          this._isError = true;
          this._error = this._result['error'];
        } else {
          this._isError = false;
          if ('warning' in this._result) {
            this._isWarning = true;
            this._warning = this._result['warning'];
          } else {
            this._isWarning = false;
          }
          this.updateAttributes();
        }

      },
      (error) => {
        this._translateNotificationsService.error('Uh-oh, an error occurred!', error);
      },
      () => {
        this.stopKeepInformed();
        this._isCancel = false;
      }
    );
    // this.autoKeepInformed();
  }

  public startKeepInformed(id?: string) {
    if (id) {
      this._params.id = id;
      this._isScraping = true;
    }
    this._refreshIntervalId = setInterval(() => {
      this.autoKeepInformed();
    }, 2000);
  }

  public stopKeepInformed() {
    clearInterval(this._refreshIntervalId);
    this._keepInformed = 'Starting a crawling';
  }

  onClickCancel(): void {
    this._isCancel = true;
    this.stopKeepInformed();
    this._showKeepInformed = false;
    this._scrapingService.cancelScraping(this.getJsonId()).subscribe(
      (value) => {
        this._translateNotificationsService.success('Cancel request', 'Request has been canceled');
      },
      (error) => {
        this._translateNotificationsService.error('Uh-oh, an error occurred!', error);
      }
    );
  }

  private getJsonId(): any {
    return {id: this._params['id']};
  }

  private autoKeepInformed(): void {
    this._scrapingService.checkScraping(this.getJsonId()).subscribe(
      (value) => {
        this._keepInformed = value['info'];
        this._result = value;
        this.updateAttributes();
      },
      (error) => {
        this._translateNotificationsService.error('Uh-oh, an error occurred!', error);
      },
      () => {
      }
    );
  }

  public activateSidebar() {
    this._sidebarValue = {
      animate_state: 'active',
      title: 'Advanced settings',
      size: '726px'
    };
  }


  public values(string: any): any {
    const arrayValue = [string];
    for (const key of this._attributes) {
      if (key !== 'email') {
        arrayValue.push(this._result.pros[string][key]);
      }
    }
    return arrayValue;
  }

  public onClickCopy(): void {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('result'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
    this._translateNotificationsService.success(
      'Success',
      'The result has been copy to the clipboard'
    );
  }

  public updateAttributes(): void {
    this._attributes = ['email'];
    const pros = Object.values(this._result.pros);
    if (pros.length !== 0) {
      let isRawData = false;
      for (const key of Object.keys(pros[0])) {
        if (key !== 'raw data') {
          this._attributes.push(key);
        } else {
          isRawData = true;
        }
      }
      // raw data at the end
      if (isRawData) {
        this._attributes.push('raw data');
      }
      this._showResultScraping = true;
    }
  }

  get showKeepInformed(): boolean {
    return this._showKeepInformed;
  }

  get isScraping(): boolean {
    return this._isScraping;
  }

  get isError(): boolean {
    return this._isError;
  }

  get error(): string {
    return this._error;
  }

  get isWarning(): boolean {
    return this._isWarning;
  }

  get warning(): string {
    return this._warning;
  }

  get isCancel(): boolean {
    return this._isCancel;
  }


  get showResultScraping(): boolean {
    return this._showResultScraping;
  }

  get keepInformed(): string {
    return this._keepInformed;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  get params(): any {
    return this._params;
  }

  get result_pros(): any {
    return this._result.pros;
  }

  get runningScrapings(): Array<{id: string, url: string}> {
    return this._runningScrapings;
  }

  get attributes(): any {
    return this._attributes;
  }

}

