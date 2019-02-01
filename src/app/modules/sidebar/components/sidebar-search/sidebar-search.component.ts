import {Component, EventEmitter, Input, Output} from '@angular/core';
import * as _ from 'lodash';
import {COUNTRIES} from '../../../shared/components/shared-search-pros/COUNTRIES';

@Component({
  selector: 'app-sidebar-search',
  templateUrl: './sidebar-search.component.html',
  styleUrls: ['./sidebar-search.component.scss']
})
export class SidebarSearchComponent {

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
      key: 'europe',
      name: 'Europe',
      checked: false
    },
    {
      key: 'russia',
      name: 'Russia',
      checked: false
    },
    {
      key: 'americaNord',
      name: 'North America',
      checked: false
    },
    {
      key: 'asia',
      name: 'Asia',
      checked: false
    },
    {
      key: 'americaSud',
      name: 'South America',
      checked: false
    },
    {
      key: 'africa',
      name: 'Africa',
      checked: false
    },
    {
      key: 'oceania',
      name: 'Oceania',
      checked: false
    }
  ];

  @Output() paramsChange = new EventEmitter <any>();
  @Output() close = new EventEmitter <any>();
  @Input() params: any;

  constructor() {}

  public saveParams(event: any) {
    event.preventDefault();
    event.target.id = "close";
    this.close.emit(event);
    this.paramsChange.emit(this.params);
  }

  public selectGroup(index: number) {
    if (this.groups[index]['checked']) {
      this.params.countries = _.difference(this.params.countries, this.groups[index]['countries']);
    } else {
      this.params.countries = _.union(this.params.countries, this.groups[index]['countries']);
    }
  }

  public selectContinent(continent: any) {
    if (continent.checked) {
      this.params.countries = _.difference(this.params.countries, COUNTRIES[continent.key]);
    } else {
      this.params.countries = _.union(this.params.countries, COUNTRIES[continent.key]);
    }
  }

  public checkCountry(country: string) {
    const index = this.params.countries.indexOf(country);
    if (index > -1) {
      this.params.countries.splice(index, 1);
    } else {
      this.params.countries.push(country);
    }
  }
  get countries(): any { return COUNTRIES; }

}

