import { Component, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { SharedWorldmapService } from './services/shared-worldmap.service';

@Component({
  selector: 'app-shared-worldmap',
  templateUrl: 'shared-worldmap.component.html',
  styleUrls: ['shared-worldmap.component.scss']
})

export class SharedWorldmapComponent implements OnInit {

  @Input() width: string;

  @Input() countriesColor: string = '#2ECC71';

  /***
   * use this when you have only the list of the
   * countries and want to paint them.
   * @param value
   */
  @Input() set targetingCountries(value: Array<string>) {

    this._reinitializeMap();

    if (Array.isArray(value) && value.length > 0) {
      value.forEach((country) => {
        this._colorCountry(country);
      });
    }

  }

  /***
   * use this when with the list of countries you have the data
   * and base on that data you want to paint the map.
   * @param countries
   */
  @Input() set countriesData(countries: any) {
    this._calculateCountriesData(countries);
  }

  private _showLegend: boolean = false;

  private _firstThreshold: number;

  private _secondThreshold: number;

  constructor(private _elementRef: ElementRef,
              private _sharedWorldmapService: SharedWorldmapService,
              private _viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this._sharedWorldmapService.loadCountriesFromViewContainerRef(this._viewContainerRef);
  }

  private _reinitializeMap() {
    Array.prototype.forEach.call(this._elementRef.nativeElement.getElementsByClassName('country'), (country_el: HTMLElement) => {
      country_el.style.fill = '#E2E2E2';
    });
  }

  private _colorCountry(country: string, color: string = this.countriesColor) {
    const countryElement = this._elementRef.nativeElement.getElementsByClassName(country);

    if (countryElement && countryElement.length) {
      Array.prototype.forEach.call(countryElement, (country_el: HTMLElement) => {
        country_el.style.fill = color;
      });
    } else {
      console.log(`${country} is nowhere to be found in the map.`);
    }

  }

  private _calculateCountriesData(countries: any) {
    this._showLegend = true;

    // First we create an array with all the values, without doublons
    const valuesSet = new Set();
    for (let key in countries) {
      valuesSet.add(countries[key]);
    }

    const results = Array.from(valuesSet).sort((a, b) => a - b);

    // auxiliary function to calculate the squared deviation of an array
    const getSquaredDeviation = (array: Array<number>) => {
      if (array.length) {
        const mean = array.reduce((sum, curr) => sum + curr, 0) / array.length;
        return (array.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0)) / array.length;
      } else {
        return 0;
      }
    };

    if (results.length) {
      let firstGroup: Array<number> = [];
      let secondGroup: Array<number> = [];
      let thirdGroup: Array<number> = [];
      let groups: Array<Array<number>> = [[], [], []];
      let optimalGroups = null;
      let min = getSquaredDeviation(results);

      // GO through all possibilities
      for (let i = 0; i < results.length; i++) {
        firstGroup = results.slice(0, i);
        secondGroup = results.slice(i); // Dans le cas où le tableau n'est pas assez grand pour entrer dans la boucle
        for (let j = i + 1; j < results.length; j++) {
          secondGroup = results.slice(i, j);
          thirdGroup = results.slice(j);
          groups = [firstGroup, secondGroup, thirdGroup];
          // For each possibility of subsets, we calculate the sum of squared deviations of each subset
          let sdcmAll = groups.reduce((sum, curr) => sum + getSquaredDeviation(curr), 0);
          if (sdcmAll < min) {
            // We update the mininum and the optimal subsets
            min = sdcmAll;
            optimalGroups = groups;
          }
        }
      }

      if (!optimalGroups) {
        // Si on n'a pas pu entrer dans toutes les boucles et donc définir le set optimal, on garde le set de départ
        optimalGroups = [firstGroup, secondGroup, thirdGroup];
      }

      optimalGroups = optimalGroups.filter(arr => arr.length > 0);

      if (optimalGroups.length === 1) {
        this._firstThreshold = 0;
        this._secondThreshold = 0;
      } else {
        this._secondThreshold = optimalGroups[optimalGroups.length - 1][0] - 1;
        if (optimalGroups.length == 3) {
          this._firstThreshold = optimalGroups[1][0];
        } else {
          this._firstThreshold = optimalGroups[0][optimalGroups[0].length - 1]
        }
      }
    }

    this._reinitializeMap();

    for (let country in countries) {
      const color = countries[country] < this._firstThreshold ? "#97E8B9" : countries[country] < this._secondThreshold ? "#9BDE56" : "#39CB74";
      this._colorCountry(country, color)
    }

  }

  get firstThreshold(): number {
    return this._firstThreshold;
  }

  get secondThreshold(): number {
    return this._secondThreshold;
  }

  get showLegend(): boolean {
    return this._showLegend;
  }

}
