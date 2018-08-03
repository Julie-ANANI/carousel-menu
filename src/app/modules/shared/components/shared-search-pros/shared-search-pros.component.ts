import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Campaign } from '../../../../models/campaign';
import { InnovationSettings } from '../../../../models/innov-settings';
import { COUNTRIES } from './COUNTRIES'
import { Template } from '../../../sidebar/interfaces/template';

@Component({
  selector: 'app-shared-search-pros',
  templateUrl: './shared-search-pros.component.html',
  styleUrls: ['./shared-search-pros.component.scss']
})
export class SharedSearchProsComponent implements OnInit {

  public catResult: any;
  private _suggestion: string = "";
  private _params: any;
  private _more: Template = {};
  private _googleQuota = 30000;
  private _estimatedNumberOfGoogleRequests = 0;
  private _countriesSettings: any[] = [];

  @Input() campaign: Campaign;

  constructor(private _notificationsService: TranslateNotificationsService,
              private _searchService: SearchService,
              private _authService: AuthService) {}

  ngOnInit(): void {
    this._initParams();
    this._searchService.getCountriesSettings().first().subscribe(countriesSettings => {
      this._countriesSettings = countriesSettings.countries;
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
      count: 10,
      starProfiles: 2,
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
      type: "info"
    };
    this.estimateNumberOfGoogleRequests();
  }

  changeSettings() {
    this._more = {
      animate_state: this._more.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SEARCH.SETTINGS'
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
      this._notificationsService.success('Requête ajoutée', 'La requête a bien été ajoutée à la file d\'attente');
    });
  }

  public cat() {
    this._searchService.cat(this.campaign._id, this._params.keywords, this._params.starProfiles).first().subscribe((answer: any) => {
      this.catResult = answer;
      this.estimateNumberOfGoogleRequests(answer.totalResults);
      this._params.keywords.split("\n").forEach((request: string) => {
        if (answer.requestsToDelete.indexOf(request) > -1) {
          this._suggestion += (`<span class="text-error">${request}</span><br/>`);
        } else {
          answer.warningKeywords.forEach((warningWord: string) => {
            request = request.replace(`"${warningWord}"`, `<span class="text-warning">"${warningWord}"</span>`);
          });
          this._suggestion += `${request}<br/>`;
        }
      });
    });
  }

  public applySuggestion() {
    this.catResult.requestsToDelete.forEach((request: string) => {
      this._params.keywords = this._params.keywords.replace(`${request}\n`, "");
    });
    this._suggestion = "";
    this.catResult.advice = "";
  }

  public ignoreSuggestion() {
    this._suggestion = "";
    this.catResult.advice = "";
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
              numberOfRequests += country.regions.length
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

  get suggestion(): string { return this._suggestion; }
  get params(): any { return this._params; }
  get more(): any { return this._more; }
  get googleQuota(): number { return this._googleQuota; }
  get estimatedNumberOfGoogleRequests(): number { return this._estimatedNumberOfGoogleRequests; }
  set params(value: any) { this._params = value; }
}
