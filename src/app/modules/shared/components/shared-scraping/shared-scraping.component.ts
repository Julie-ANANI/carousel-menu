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

  private _attributes = new Array();

  private _pros = new Array();

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  private _keepInformed = '';

  private _isScraping = false;

  private _isError = false;

  private _error = '';

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

  onClickSearch(event: Event): void {
    this._showResultScraping = false;
    this._showKeepInformed = true;
    this._isScraping = true;
    this._isError = false;
    const scrapeParams = this._params;
    console.log('url :', scrapeParams['url']);
    console.log(scrapeParams);
    const refreshIntervalId = setInterval (() => {
      this.autoKeepInformed();
    }, 1000);
    this._scrapingService.getScraping(scrapeParams).subscribe(
      (value) => {
        this._showKeepInformed = false;
        this._isScraping = false;
        this._result = value;
        console.log('Resultat : ', this._result);
        if ('error' in this._result) {
          this._isError = true;
          this._error = this._result['error'];
        } else {
          this._isError = false;
          this.updateMails();
          this.updateAttributes();
          this._showResultScraping = true;
        }
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ', error);
        clearInterval(refreshIntervalId);
      },
      () => {
        console.log('Observable complete!');
        clearInterval(refreshIntervalId);
      }
    );
    this.autoKeepInformed();
  }

  onClickCancel(event: Event): void {
    console.log('send Cancel to ', this.getJsonId());
    this._scrapingService.cancelScraping(this.getJsonId()).subscribe(
      (value) => {
        console.log('Resultat : ', value);
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
        console.log('id : ', this._params['id']);
        console.log('Check result : ', value);
        this._keepInformed = value['info'];
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ', error);
      },
      () => {
        console.log('Observable complete!');
      }
    );
    console.log('Hello from autoKeepInformed');
  }

  // private updateKeepInformed(value: string): void {
  //   this._keepInformed = value['info'];
  // }

  private updateMails(): void {
    this._pros = [];
    for (const key of Object.keys(this._result)) {
      this._pros.push(key);
    }
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

  get result(): any {
    return this._result;
  }

  public updateAttributes(): void {
    this._attributes = ['email'];
    const pros = Object.values(this._result);
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
        arrayValue.push(this._result[string][key]);
      }
    }
    return arrayValue;
  }

  public updateSettings(value: any) {
    this._params = value;
    console.log(this._params);
    // this._localStorageService.setItem('searchSettings', JSON.stringify(value));
    this._translateNotificationsService.success(
      'Success',
      'The settings has been updated.'
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
      // isLoadMore: false,
      // loadMore: '',
      // numberLoadMore: 1,
      // waitTimeLoadMore: 0,
      // skipMails: '',
      // isSpecificData: false,
      numberSpecificData: 0,
      specificData: [{}, {}, {}, {}, {}],
      isCrawling: false,
      // isField: false,
      numberFields: 0,
      fields: [{}, {}, {}, {}, {}],
      // maxRequest: 300,
      isSingle: false,
      linkPro: '',
      id: Math.floor(Math.random() * 1000000)
    };
  }
}

