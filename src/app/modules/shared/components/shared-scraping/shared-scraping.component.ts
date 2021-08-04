import {Component, Input, OnInit} from '@angular/core';
import {RolesFrontService} from '../../../../services/roles/roles-front.service';
import {ScrapingService} from '../../../../services/scraping/scraping.service';
import {SidebarInterface} from '../../../sidebars/interfaces/sidebar-interface';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';

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

  private _keepInformed = '';

  private _isScraping = false;

  private _isError = false;

  private _isWarning = false;

  private _error = '';

  private _warning = '';

  private _refreshIntervalId: any = null;

  constructor(private _rolesFrontService: RolesFrontService,
              private _scrapingService: ScrapingService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(
      this.accessPath.concat(path)
    );
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
        console.log('Result : ', this._result);
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
          this._showResultScraping = true;
        }
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ', error);
      },
      () => {
        console.log('Observable complete!');
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
    console.log('url :', scrapeParams['url']);
    console.log('scrape options :', scrapeParams);
    this.startKeepInformed();
    this._scrapingService.getScraping(scrapeParams).subscribe(
      (value) => {
        this._showKeepInformed = false;
        this._isScraping = false;
        this._result = value;
        console.log('Result : ', this._result);
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
          this._showResultScraping = true;
        }

      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ', error);
      },
      () => {
        console.log('Observable complete!');
        this.stopKeepInformed();
      }
    );
    this.autoKeepInformed();
  }

  public startKeepInformed() {
    this._refreshIntervalId = setInterval(() => {
      this.autoKeepInformed();
    }, 1000);
  }

  public stopKeepInformed() {
    clearInterval(this._refreshIntervalId);
  }

  onClickCancel(): void {
    console.log('send Cancel to ', this.getJsonId());
    this.stopKeepInformed();
    this._scrapingService.cancelScraping(this.getJsonId()).subscribe(
      (value) => {
        console.log('Result : ', value);
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ', error);
      },
      () => {
        console.log('Observable complete!');
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
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ', error);
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
    }
  }

  get attributes(): any {
    return this._attributes;
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
    console.log('Click Copy!');
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

  ngOnInit(): void {
    this._initParams();
  }

  private _initParams() {
    this._params = {
      url: '',
      rawData: false,
      // formattedAddress: false,
      // whereFormattedAddress: '',
      dynamicHTML: false,
      loadMore: '',
      // skipMails: ''
      numberSpecificData: 0,
      specificData: [{}, {}, {}, {}, {}],
      isCrawling: false,
      isSpider: false,
      numberFields: 0,
      fields: [{}, {}, {}, {}, {}],
      isSingle: false,
      linkPro: '',
      id: Math.floor(Math.random() * 1000000)
    };
  }
}

