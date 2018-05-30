import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Campaign } from '../../../../models/campaign';
import { InnovationSettings } from '../../../../models/innov-settings';
import { COUNTRIES } from './COUNTRIES'
import * as _ from 'lodash';

@Component({
  selector: 'app-shared-search-pros',
  templateUrl: './shared-search-pros.component.html',
  styleUrls: ['./shared-search-pros.component.scss']
})
export class SharedSearchProsComponent implements OnInit {

  public displaySettings = false;
  public groups = [
    {
      name: 'G8',
      checked: false,
      countries: ['US', 'JP', 'DE', 'FR', 'UK', 'IT', 'CA', 'RU']
    },
    {
      name: 'G20',
      checked: false,
      countries: ['US', 'JP', 'DE', 'FR', 'UK', 'IT', 'CA', 'RU', 'ZA', 'SA',
        'AR', 'AU', 'BR', 'CN', 'KR', 'IN', 'ID', 'MX', 'TR']
    },
    {
      name: 'G30',
      checked: false,
      countries: ['US', 'JP', 'DE', 'FR', 'UK', 'IT', 'CA', 'RU', 'ZA', 'SA', 'AR', 'AU', 'BR', 'CN',
        'KR', 'IN', 'ID', 'MX', 'TR', 'PT', 'BE', 'IE', 'CH', 'SE', 'NO', 'PL', 'CZ', 'ES', 'NL']
    },
    {
      name: 'EU1',
      checked: false,
      countries: ['FR', 'UK', 'DE', 'ES', 'IT', 'NL', 'CH', 'NO', 'SE', 'PL', 'BE']
    },
    {
      name: 'EU2',
      checked: false,
      countries: ['FR', 'UK', 'DE', 'ES', 'IT', 'NL', 'CH', 'NO', 'SE', 'PL', 'BE', 'AT',
        'DK', 'FI', 'GR', 'IE', 'PT', 'CZ', 'RO', 'UA', 'HU', 'SK', 'BY', 'HR']
    }
  ];
  public continents = [
    {
      key: "europe",
      name: "Europe",
      checked: false
    },
    {
      key: "russia",
      name: "Russia",
      checked: false
    },
    {
      key: "americaNord",
      name: "North America",
      checked: false
    },
    {
      key: "asia",
      name: "Asia",
      checked: false
    },
    {
      key: "americaSud",
      name: "South America",
      checked: false
    },
    {
      key: "africa",
      name: "Africa",
      checked: false
    },
    {
      key: "oceania",
      name: "Oceania",
      checked: false
    }
  ];
  private _params: any;

  @Input() campaign: Campaign;

  constructor(private _notificationsService: TranslateNotificationsService,
              private _searchService: SearchService,
              private _authService: AuthService) {}

  ngOnInit(): void {
    this._initParams();
  }
  
  private _initParams() {
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
      automated: false,
      smart: false,
      regions: false,
      indexSearch: false,
      countries: [],
      queued: false
    };
    
    if (this.campaign) {
      this._params.automated = true;
      this._params.smart = true;
      this._params.regions = true;
      this._params.queued = true;
      this._params.count = 100;
      this._params.campaign = this.campaign._id;
      if (this.campaign.innovation && this.campaign.innovation.settings && this.campaign.innovation.settings) {
        this._params.countries = this.getTargetCountries(this.campaign.innovation.settings);
      }
    }
  }

  public selectGroup(index: number) {
    if (this.groups[index]['checked']) {
      this._params.countries = _.difference(this._params.countries, this.groups[index]['countries']);
    } else {
      this._params.countries = _.union(this._params.countries, this.groups[index]['countries']);
    }
  }

  public selectContinent(continent: any) {
    if (continent.checked) {
      this._params.countries = _.difference(this._params.countries, COUNTRIES[continent.key]);
    } else {
      this._params.countries = _.union(this._params.countries, COUNTRIES[continent.key]);
    }
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

  public checkCountry(country: string) {
    const index = this._params.countries.indexOf(country);
    if (index > -1) {
      this._params.countries.splice(index, 1);
    } else {
      this._params.countries.push(country);
    }
  }

  public search(event: Event): void {
    event.preventDefault();
    const searchParams = this._params;
    searchParams.name = 'people';
    searchParams.user = this._authService.getUserInfo();
    searchParams.websites = Object.keys(searchParams.websites).filter(key => searchParams.websites[key]).join(' ');
    this._searchService.search(searchParams).first().subscribe(result => {
      this._initParams();
      this._notificationsService.success("Requête ajoutée", "La requête a bien été ajoutée à la file d'attente");
    });
  }

  get countries(): any { return COUNTRIES; }
  get params(): any { return this._params; }
  set params(value: any) { this._params = value; }
}
