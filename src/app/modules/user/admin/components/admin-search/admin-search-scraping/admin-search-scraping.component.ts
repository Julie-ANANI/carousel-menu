import {Component, OnInit} from '@angular/core';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {ScrapingService} from '../../../../../../services/scraping/scraping.service';
import {SidebarInterface} from '../../../../../sidebars/interfaces/sidebar-interface';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-admin-search-scraping',
  templateUrl: './admin-search-scraping.component.html',
  styleUrls: ['./admin-search-scraping.component.scss']
})
export class AdminSearchScrapingComponent implements OnInit {

  private _accessPath: Array<string> = ['search', 'scraping'];

  private _params: any = null;

  private _showResultScraping = false;

  private _result = 'TEST';

  private _attributes = new Array();

  private _pros = new Array();

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  constructor(private _rolesFrontService: RolesFrontService,
              private _scrapingService: ScrapingService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

  onClickSearch(event: Event): void {
    const scrapeParams = this._params;

    console.log('url :', scrapeParams['url']);
    console.log(scrapeParams);
    this._scrapingService.getScraping(scrapeParams).subscribe(
      (value) => {
        this._result = value;
        console.log('Resultat : ', this._result);
        this.updateMails();
        this.updateAttributes();
        this._showResultScraping = true;
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ', error);
      },
      () => {
        console.log('Observable complete!');
      }
    );

  }

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
        };
    }

  get showResultScraping(): boolean {
    return this._showResultScraping;
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
      formattedAddress: false,
      whereFormattedAddress: '',
      dynamicHTML: false,
      isLoadMore: false,
      loadMore: '',
      numberLoadMore: 1,
      waitTimeLoadMore: 0,
      skipMails: '',
      isSpecificData: false,
      numberSpecificData: 1,
      specificData: [{}, {}, {}, {}, {}],
      isCrawling: false,
      isField: false,
      numberFields: 1,
      fields: [{}, {}, {}, {}, {}],
      maxRequest: 300,
      isSingle: false,
      linkPro: ''
    };
  }
}

