import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../models/innovation';
import { Country } from '../../../../models/country';
import { WorldmapService } from "../../../../services/worldmap/worldmap.service";

@Component({
  selector: 'app-shared-targeting-detail',
  templateUrl: './shared-targeting-detail.component.html',
  styleUrls: ['./shared-targeting-detail.component.scss']
})

export class SharedTargetingDetailComponent {

  @Input() set project(value: Innovation) {
    this._innovation = value;

    if (this._innovation.settings && this._innovation.settings.geography) {

      if (this._innovation.settings.geography.include.length > 0) {
        this._targetCountries = this._innovation.settings.geography.include.reduce((acc, country) => {
          acc.push(country.code);
          return acc;
        }, []);
      } else {
        this._getCountries(this._innovation.settings.geography.continentTarget);
      }

    }

  }

  private _innovation: Innovation;

  private _targetCountries: Array<string> = [] ;

  constructor(private _worldMapService: WorldmapService) { }

  private _getCountries(continent: any) {
    this._worldMapService.getCountriesList().then(response => {
      let countries: Array<Country> = [];

      for (const prop in continent) {
        if (continent.hasOwnProperty(prop)) {
          if (continent[prop]) {
            if (this._innovation.settings.geography.exclude.length > 0) {
              countries = response.filter((value) => {
                return !this._innovation.settings.geography.exclude.find((value2) => value2.flag === value.code);
              });
            } else {
              countries = response;
            }
          }
        }
      }
      this._targetCountries = countries.reduce((acc, country) => {
        acc.push(country.code);
        return acc;
      }, []);
    });
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get targetCountries(): Array<string> {
    return this._targetCountries;
  }

}
