import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Campaign } from '../../../../models/campaign';
import { InnovationSettings } from '../../../../models/innov-settings';
import {Template} from '../../../shared/components/shared-sidebar/interfaces/template';
import { COUNTRIES } from'./COUNTRIES'

@Component({
  selector: 'app-shared-search-pros',
  templateUrl: './shared-search-pros.component.html',
  styleUrls: ['./shared-search-pros.component.scss']
})
export class SharedSearchProsComponent implements OnInit {

  private _params: any;
  private _more: Template = {};
  private _googleQuota: number = 30000;
  private _estimatedNumberOfGoogleRequests: number = 0;
  private _countriesSettings: any[] = [];

  @Input() campaign: Campaign;

  constructor(private _notificationsService: TranslateNotificationsService,
              private _searchService: SearchService,
              private _authService: AuthService) {}

  ngOnInit(): void {
    this._initParams();
    this._searchService.getCountriesSettings().first().subscribe(countriesSettings => {
      this._countriesSettings = countriesSettings.countries;
      console.log(this._countriesSettings);
    });
  }

  private _initParams() {
    this.getGoogleQuota();
    this._params = {
      keywords: '',
      websites: {
        linkedin: true,
        viadeo: false,
        kompass: false,
        xing: false
      },
      count: '10',
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
    this.estimateNumberOfGoogleRequests();
  }

  changeSettings() {
    this._more = {
      animate_state: this._more.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SEARCH.ADVANCEDSEARCH'
    };
  }

  public getGoogleQuota() {
    this._searchService.dailyStats().first().subscribe(result => {
      this._googleQuota = 30000;
      if (result.hours) {
        this._googleQuota -= result.hours.slice(7).reduce((sum: number, hour: any) => sum + hour.googleQueries, 0)
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
    this._searchService.search(searchParams).first().subscribe(_ => {
      this._initParams();
      this._notificationsService.success("Requête ajoutée", "La requête a bien été ajoutée à la file d'attente");
    });
  }

  public estimateNumberOfGoogleRequests() {
    const numberOfSearches = this._params.keywords.split("\n").length;
    let numberOfRequests = 1;
    const selectedCountries = this._params.countries;
    let smartCountries = 0;
    if (this._params.options.smart || this._params.options.regions) {
      this._countriesSettings.forEach((country: any) => {
        if (selectedCountries.indexOf(country.code) > -1) {
          smartCountries++;
          if (this._params.options.regions && country.regions.length) {
            numberOfRequests += country.regions.length
          } else {
            numberOfRequests++;
          }
        }
      });
    }
    if (!this._params.options.smart) {
      numberOfRequests += (selectedCountries.length - smartCountries);
    }
    this._estimatedNumberOfGoogleRequests = numberOfSearches * numberOfRequests * this._params.count / 10;
  }

  get params(): any { return this._params; }
  get more(): any { return this._more; }
  get googleQuota(): number { return this._googleQuota; }
  get estimatedNumberOfGoogleRequests(): number { return this._estimatedNumberOfGoogleRequests; }
  get countriesSettings(): any { return this._countriesSettings; }
  set countriesSettings(value: any) { this._countriesSettings = value; }
  set params(value: any) { this._params = value; }
}
