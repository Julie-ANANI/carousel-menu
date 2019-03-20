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

  private _suggestion: { expected: number, kw: string }[] = [];
  private _params: any;
  private _more: SidebarInterface = {};
  private _googleQuota = 30000;
  private _catQuota = 100;
  private _estimatedNumberOfGoogleRequests = 0;
  private _countriesSettings: any[] = [];
  public showText = false;
  public catResult: any;

  @Input() campaign: Campaign;

  constructor(private _notificationsService: TranslateNotificationsService,
              private _searchService: SearchService,
              private _authService: AuthService) {}

  ngOnInit(): void {
    this._initParams();
    this._searchService.getCountriesSettings().pipe(first()).subscribe((countriesSettings: any) => {
      this._countriesSettings = countriesSettings.countries;
    });
  }

  private _initParams() {
    this.getGoogleQuota();
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
    this.catResult = {
      duplicate_status: 'ok',
    };
    this.estimateNumberOfGoogleRequests();

    this._suggestion = [];
  }

  changeSettings() {
    this._more = {
      animate_state: this._more.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SEARCH.SETTINGS'
    };
  }

  displayStars() {
    this._more_cat = {
      animate_state: this._more.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SEARCH.STAR_PROFILES'
    };
  }

  public getGoogleQuota() {
    this._searchService.dailyStats().pipe(first()).subscribe((result: any) => {
      this._googleQuota = 30000;
      if (result.hours) {
        this._googleQuota -= result.hours.slice(7).reduce((sum: number, hour: any) => sum + hour.googleQueries, 0);
      }
    });
  }

  public getCatQuota() {
    this._searchService.dailyStats().pipe(first()).subscribe((result: any) => {
      this._catQuota = 100;
      if (result.hours) {
        this._catQuota -= result.hours.slice(7).reduce((sum: number, hour: any) => sum + hour.googleQueriesCat, 0);
      }
    });
  }

  updateSettings(value: any) {
    this._params = value;
    this.estimateNumberOfGoogleRequests();
  }

  closeSidebar(value: string) {
    this.more.animate_state = value;
  }

  public getTargetCountries(settings: InnovationSettings): Array<string> {
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

  public search(event: Event): void {
    event.preventDefault();
    const searchParams = this._params;
    searchParams.metadata = {user: this._authService.getUserInfo()};
    searchParams.websites = Object.keys(searchParams.websites).filter(key => searchParams.websites[key]).join(' ');
    this._searchService.search(searchParams).pipe(first()).subscribe((_: any) => {
      this._initParams();
      this._notificationsService.success('Requête ajoutée', 'La requête a bien été ajoutée à la file d\'attente');
    });
  }

  /***
   *
   * @param {Event} event: pressed button
   * > update Computer Aided Targeting statistics (SearchService)
   * > Trigger the CAT analysis (NLPService)
   * > format the result and store it in the catResult object
   */
  public cat(event: Event): void {
    event.preventDefault();
    this._searchService.updateCatStats(this._params.catKeywords.split('\n').length).subscribe((response: any) => {});
    this._searchService.computerAidedTargeting(this._params.catKeywords.split('\n')).pipe(first()).subscribe((response: any) => {
      this.resetCat();
      this.catResult.total_result = [];
      Object.entries(response.total_result).forEach(([key, value]) => {
        this.catResult.total_result.push(value);
      });
      this.estimateNumberOfGoogleRequests(this.catResult.total_result);

      this.catResult.keywords_analysis = response.keywords_analysis.kw;

      let expected_result;
      this._params.catKeywords.split('\n').forEach((request: string) => {
        expected_result = response.total_result[request];
        Object.entries(response.keywords_analysis.kw).forEach(([key, value]) => {
          if (value < 0.5) {
            request = request.replace(`${key}`, `<span class="text-error">${key}</span>`);
          } else if (value < 0.8) {
            request = request.replace(`${key}`, `<span class="text-warning">${key}</span>`);
          } else {
            request = request.replace(`${key}`, `<span class="text-success">${key}</span>`);
          }
        });
        this._suggestion.push({'expected': expected_result, 'kw': request});
      });

      this.catResult.new_keywords = [];
      Object.entries(response.keywords_analysis.new).forEach(([key, value]) => {
        this.catResult.new_keywords.push(key);
      });

      this.catResult.duplicate_status = response.duplicate_status;

      this.catResult.profile = response.stars;
    });
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

  public estimateNumberOfGoogleRequests(totalResultsArray?: Array<number>) {
    totalResultsArray = totalResultsArray || this._params.keywords.split('\n').filter((k: string) => k).fill(1000000);
    this._estimatedNumberOfGoogleRequests = totalResultsArray.reduce((acc: number, curr: number) => {
      return acc + this._estimateNumberOfGoogleRequestsForOneSearch(curr);
    }, 0);
  }

  /***
   * Delete the previous Computer Aided Targeting result
   */
  public resetCat() {
    this.catResult = {
      duplicate_status: 'ok',
    };
    this._suggestion = [];
    this.estimateNumberOfGoogleRequests();
  }

  get suggestion(): any { return this._suggestion; }
  get params(): any { return this._params; }
  get more(): any { return this._more; }
  get googleQuota(): number { return this._googleQuota; }
  get catQuota(): number { return this._catQuota; }
  get estimatedNumberOfGoogleRequests(): number { return this._estimatedNumberOfGoogleRequests; }
  get catDone(): any { return this.catResult.keywords_analysis; }
  set params(value: any) { this._params = value; }
}
