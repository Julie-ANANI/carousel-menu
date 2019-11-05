import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../models/innovation';
import { IndexService } from '../../../../services/index/index.service';
import { Response } from '../../../../models/response';
import { Country } from '../../../../models/country';

@Component({
  selector: 'app-shared-targeting-detail',
  templateUrl: './shared-targeting-detail.component.html',
  styleUrls: ['./shared-targeting-detail.component.scss']
})

export class SharedTargetingDetailComponent {

  @Input() set project(value: Innovation) {
    this._innovation = value;

    if (this._innovation.settings && this._innovation.settings.geography.include.length === 0 ) {
      this._getCountries(this._innovation.settings.geography.continentTarget);
    }

  }

  private _innovation: Innovation;

  private _targetCountries: Array<string> = [] ;

  constructor(private _indexService: IndexService) { }

  private _getCountries(continent: any) {
    this._indexService.getWholeSet({ type: 'countries' }).subscribe((response: Response) => {

      let countries: Array<Country> = response.result;

      for (const prop in continent) {
        if (continent.hasOwnProperty(prop)) {
          if (continent[prop]) {
            countries = countries.filter((value) => {
              return this._innovation.settings.geography.exclude.some((value2) => value2.name !== value.name);
            });
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
