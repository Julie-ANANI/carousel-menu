import {Router} from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Campaign } from '../../../../models/campaign';
import { InnovationSettings } from '../../../../models/innov-settings';
import { COUNTRIES } from './COUNTRIES'

@Component({
  selector: 'app-shared-search-pros',
  templateUrl: './shared-search-pros.component.html',
  styleUrls: ['./shared-search-pros.component.scss']
})
export class SharedSearchProsComponent implements OnInit {

  public displaySettings = false;
  private _params: any = {
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

  @Input() campaign: Campaign;

  constructor(private _searchService: SearchService,
              private _authService: AuthService,
              private _router: Router) {}

  ngOnInit(): void {
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
    console.log(this._params.countries);
  }

  public search(event: Event): void {
    event.preventDefault();
    const searchParams = this._params;
    searchParams.name = 'people';
    searchParams.user = this._authService.getUserInfo();
    searchParams.websites = Object.keys(searchParams.websites).filter(key => searchParams.websites[key]).join(' ');
    this._searchService.search(searchParams).first().subscribe(result => {
      this._router.navigateByUrl('/admin/' + (this.campaign ? 'campaigns/campaign/' + this.campaign._id : 'search') +  '/results/' + result.id);
    });
  }

  public buildImageUrl(country: string): string {
    if (country) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }

  get countries(): any { return COUNTRIES; }
  get continents(): any { return Object.keys(COUNTRIES); }
  get params(): any { return this._params; }
  set params(value: any) { this._params = value; }
}
