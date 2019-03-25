import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Campaign } from '../../../../models/campaign';
import { InnovationSettings } from '../../../../models/innov-settings';
import { COUNTRIES } from './COUNTRIES';
import { SidebarInterface } from '../../../sidebar/interfaces/sidebar-interface';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-shared-search-pros',
  templateUrl: './shared-search-pros.component.html',
  styleUrls: ['./shared-search-pros.component.scss']
})

export class SharedSearchProsComponent implements OnInit {

  @Input() campaign: Campaign;

  private _suggestions: Array<{ expected_result: number, search_keywords: string; keywords: string }> = [];

  private _params: any;

  private _sidebarValue: SidebarInterface = {};

  private _googleQuota = 30000;

  private _catQuota = 100;

  private _estimatedNumberOfGoogleRequests = 0;

  private _countriesSettings: any[] = [];

  private _catResult: any;

  private _displayLoader = false;

  constructor(private translateNotificationsService: TranslateNotificationsService,
              private searchService: SearchService,
              private authService: AuthService) {

    this.searchService.getCountriesSettings().pipe(first()).subscribe((countriesSettings: any) => {
      this._countriesSettings = countriesSettings.countries;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });

  }

  ngOnInit(): void {
    this._initParams();
  }


  private _initParams() {
    this.getGoogleQuota();

    this.getCatQuota();

    this._params = {
      keywords: '',
      catKeywords: '',
      websites: {
        linkedin: true,
        viadeo: false,
        kompass: false,
        xing: false
      },
      count: 10,
      starProfiles: 5,
      country: '',
      countries: [],
      options: {
        automated: false,
        smart: false,
        regions: false,
        indexSearch: false
      }
    };

    if (this.campaign) {
      this._params.options.automated = true;
      this._params.options.smart = true;
      this._params.options.regions = true;
      this._params.count = 100;
      this._params.campaign = this.campaign._id;
      if (this.campaign.innovation && this.campaign.innovation.settings && this.campaign.innovation.settings) {
        this._params.countries = this.getTargetCountries(this.campaign.innovation.settings);
      }
    }

    this._catResult = { duplicate_status: 'ok' };

    this.estimateNumberOfGoogleRequests();

    this._suggestions = [];

  }


  private getGoogleQuota() {
    this.searchService.dailyStats().pipe(first()).subscribe((result: any) => {
      this._googleQuota = 30000;
      if (result.hours) {
        this._googleQuota -= result.hours.slice(7).reduce((sum: number, hour: any) => sum + hour.googleQueries, 0);
      }
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  private estimateNumberOfGoogleRequests(totalResultsArray?: Array<number>) {
    totalResultsArray = totalResultsArray || this._params.keywords.split('\n').filter((k: string) => k).fill(1000000);

    this._estimatedNumberOfGoogleRequests = totalResultsArray.reduce((acc: number, curr: number) => {
      return acc + this._estimateNumberOfGoogleRequestsForOneSearch(curr);
    }, 0);

  }


  private _estimateNumberOfGoogleRequestsForOneSearch(totalResults: number): number {
    let numberOfRequests = 0;
    const selectedCountries = this._params.countries;
    let smartCountries = 0;

    if (this._params.options.smart || this._params.options.regions) {
      this._countriesSettings.forEach((country: any) => {
        if (selectedCountries.indexOf(country.code) > -1) {
          smartCountries++;
          if (!this._params.options.smart || country.threshold < totalResults) {
            if (this._params.options.regions && country.regions.length) {
              numberOfRequests += country.regions.length;
            } else {
              numberOfRequests++;
            }
          }
        }
      });
    }

    if (!this._params.options.smart) {
      numberOfRequests += ((selectedCountries.length || 1) - smartCountries);
    }

    return (numberOfRequests || 1) * this._params.count / 10;

  }

  private getTargetCountries(settings: InnovationSettings): Array<string> {
    let countries: Array<string> = [];

    if (settings && settings.geography) {
      // On ajoute d'abord les pays appartenants aux continents sélectionnés
      for (const continent in settings.geography.continentTarget) {
        if (settings.geography.continentTarget[continent]) {
          countries = countries.concat(COUNTRIES[continent]);
        }
      }

      // Puis on enlève les pays exclus
      if (settings.geography.exclude) {
        countries = countries.filter((c: any) => settings.geography.exclude.map((c: any) => c.flag).indexOf(c) === -1);
      }

    }
    return countries;

  }


  /***
   * delete the previous Computer Aided Targeting result
   */
  onReset() {
    this._catResult = { duplicate_status: 'ok' };
    this._suggestions = [];
    this.estimateNumberOfGoogleRequests();
  }


  onClickSettings() {
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'Advanced Search',
      size: '726px'
    };
  }


  /***
   *
   * @param {Event} event: pressed button
   * > update Computer Aided Targeting statistics (SearchService)
   * > Trigger the CAT analysis (NLPService)
   * > format the result and store it in the catResult object
   */
  onClickSearchCat(event: Event): void {
    event.preventDefault();

    this._displayLoader = true;

    this.searchService.updateCatStats(this._params.catKeywords.split('\n').length).pipe(first()).subscribe((response: any) => {});

    this.searchService.computerAidedTargeting(this._params.catKeywords.split('\n')).pipe(first()).subscribe((response: any) => {

      this._displayLoader = false;

      this.onReset();

      this._catResult.total_result = [];

      Object.entries(response.total_result).forEach(([key, value]) => {
        this._catResult.total_result.push(value);
      });

      this.estimateNumberOfGoogleRequests(this._catResult.total_result);

      this._catResult.keywords_analysis = response.keywords_analysis.kw;

      let expected_result;

      let keywords;

      this._params.catKeywords.split('\n').forEach((request: string) => {
        expected_result = response.total_result[request];
        keywords = request;
        Object.entries(response.keywords_analysis.kw).forEach(([key, value]) => {
          if (value < 0.5) {
            request = request.replace(`${key}`, `<span class="text-error">${key}</span>`);
          } else if (value < 0.8) {
            request = request.replace(`${key}`, `<span class="text-warning">${key}</span>`);
          } else {
            request = request.replace(`${key}`, `<span class="text-success">${key}</span>`);
          }

        });
        this._suggestions.push({expected_result: expected_result, search_keywords: request, keywords: keywords});
      });

      this._catResult.new_keywords = [];

      Object.entries(response.keywords_analysis.new).forEach(([key, value]) => {
        this._catResult.new_keywords.push(key);
      });

      this._catResult.duplicate_status = response.duplicate_status;

      this._catResult.profile = response.stars;

      this.getCatQuota();

    }, () => {
      this._displayLoader = false;
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }

  private getCatQuota() {
    this.searchService.dailyStats().pipe(first()).subscribe((result: any) => {
      this._catQuota = 100;
      if (result.hours) {
        this._catQuota -= result.hours.slice(7).reduce((sum: number, hour: any) => sum + hour.googleQueriesCat, 0);
      }
    }, () => {

    });
  }


  onClickPlus(search_keywords: string) {
    this._params.keywords += `${search_keywords}\n`;
  }


  checkKeywords(keywords: string): string {
    if (this._params.keywords.includes(keywords)) {
      return 'hidden';
    }

    return 'visible';
  }


  onClickSearch(event: Event): void {
    event.preventDefault();

    const searchParams = this._params;

    searchParams.metadata = {user: this.authService.getUserInfo()};

    searchParams.websites = Object.keys(searchParams.websites).filter(key => searchParams.websites[key]).join(' ');

    this.searchService.search(searchParams).pipe(first()).subscribe((_: any) => {
      this._initParams();
      this.translateNotificationsService.success('ERROR.SUCCESS', 'The request has been added to the queue successfully.');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  getCatCircleClass(): string {
    return this._catQuota > 50 ? 'circle-success' : (this._catQuota > 10 && this._catQuota <= 50) ? 'circle-progress' : 'circle-alert';
  }


  getCircleClass(): string {
    return this._googleQuota > 10000 ? 'circle-success' : (this._googleQuota < 10000 && this._googleQuota > 5000) ? 'circle-progress' : 'circle-alert';
  }


  updateSettings(value: any) {
    this._params = value;
    this.estimateNumberOfGoogleRequests();
    this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.SEARCH.SETTINGS_UPDATED');
  }


  get suggestions(): Array<{ expected_result: number; search_keywords: string; keywords: string }> {
    return this._suggestions;
  }

  get params(): any {
    return this._params;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }


  get googleQuota(): number {
    return this._googleQuota;
  }

  get catQuota(): number {
    return this._catQuota;
  }

  get estimatedNumberOfGoogleRequests(): number {
    return this._estimatedNumberOfGoogleRequests;
  }

  get catProcessDone(): any {
    return this._catResult.keywords_analysis;
  }

  set params(value: any) {
    this._params = value;
  }

  get displayLoader(): boolean {
    return this._displayLoader;
  }

  get catResult(): any {
    return this._catResult;
  }

}
