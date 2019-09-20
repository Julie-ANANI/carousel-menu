import { Component, ElementRef, HostListener, Input, OnInit, ViewContainerRef } from '@angular/core';
import { SharedWorldmapService } from './services/shared-worldmap.service';
import { Response } from '../../../../models/response';
import { IndexService } from '../../../../services/index/index.service';
import { Country } from '../../../../models/country';

export interface Tooltip {
  flag?: string;
  name?: string;
  value?: number;
}

@Component({
  selector: 'app-shared-worldmap',
  templateUrl: 'shared-worldmap.component.html',
  styleUrls: ['shared-worldmap.component.scss']
})

export class SharedWorldmapComponent implements OnInit {

  @Input() width: string;

  @Input() countriesColor: string = '#2ECC71';

  @Input() isShowableQuartiles: boolean = true;

  /***
   * true: to show the information over the country.
   * @param value
   */
  @Input() set isShowableTooltip(value: boolean) {
    this._isShowableTooltip = value;
    this._getAllCountries();
  }

  /***
   * thresholds to color the countries.
   * @param value
   */
  @Input() set quartiles (value: [number, number, number]) {
    this._quartiles = value;
  }

  /***
   * Above this value, we display > 10000
   * instead of the true value.
   * @param value
   */
  @Input() set maxValue (value: number) {
    this._maxValue = value;
  }

  /***
   * Below this value, we display < 10
   * instead of the true value.
   * @param value
   */
  @Input() set minValue (value: number) {
    this._minValue = value;
  }

  /***
   * for the demo.
   * @param value
   */
  @Input() set demoCountriesData(value: any) {
    this._type = 'demo';
    this._demoCountriesData = value;
    this._setCountryColor();
  }

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
   * and base on that data you want to paint the map. For
   * example synthesis.
   * @param countries
   */
  @Input() set countriesData(countries: any) {
    this._calculateCountriesData(countries);
  }

  private _showLegend: boolean = false;

  private _firstThreshold: number;

  private _secondThreshold: number;

  private _quartiles: [number, number, number];

  private _isShowableTooltip: boolean = false;

  private _demoCountriesData: any;

  private _tooltipPosition: any = {};

  private _tooltipInfo: Tooltip = null; // it has country code, name and value of it.

  private _allCountries: Array<Country> = [];

  private _maxValue: number;

  private _minValue: number;

  private _type: string = ''; // based on this fill the tooltip.

  constructor(private _elementRef: ElementRef,
              private _indexService: IndexService,
              private _sharedWorldmapService: SharedWorldmapService,
              private _viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this._sharedWorldmapService.loadCountriesFromViewContainerRef(this._viewContainerRef);
  }

  private _getAllCountries() {
    this._indexService.getWholeSet({ type: 'countries' }).subscribe((response: Response) => {
      this._allCountries = response.result;
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this._isShowableTooltip) {
      const id = (event.target as HTMLElement).id;

      if (id) {
        this._setTooltipInfo(id);

        this._tooltipPosition = {
          left: `${event.clientX - (event.clientX - event.offsetX) - 3}px`,
          top: `${event.offsetY + 25}px`,
          opacity: 1,
          display: 'block'
        }

      } else {
        this._tooltipPosition = {
          opacity: 0,
          display: 'none'
        }
      }

    }
  }

  private _setTooltipInfo(countryId: string) {
    switch (this._type) {

      case 'demo':
        this._demoTooltip(countryId);
        break;

    }
  }

  private _demoTooltip(countryId: string) {
    const country = this._allCountries.find((country) => country.code === countryId);
    let code = country ? country.code : '';
    let name = country ? country.name : 'NA';
    let value = this._demoCountriesData[code] || "NA";

    if (this._minValue && (value || value === 0) && value <= this._minValue) {
      value = "< " + this._minValue;
    } else if (this._minValue && (value || value === 0) && value >= this._maxValue) {
      value = "> " + this._maxValue;
    }

    this._tooltipInfo = {
      flag: code,
      name: name,
      value: value
    }

  }

 private _setCountryColor() {
    if (this._demoCountriesData) {
      this._reinitializeMap();

      for (const key in this._demoCountriesData) {
        if (this._demoCountriesData.hasOwnProperty(key)) {
          if (this._demoCountriesData[key] >= this._quartiles[2]) {
            this._colorCountry(key, '#39CB74');
          } else if (this._demoCountriesData[key] >= this._quartiles[1]) {
            this._colorCountry(key, '#9BDE56');
          } else if (this._demoCountriesData[key] >= this._quartiles[0]) {
            this._colorCountry(key, '#97E8B9');
          }
        }
      }

    }
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

  public getFlagSrc(code: string): string {
    return `https://res.cloudinary.com/umi/image/upload/c_scale,h_30,w_30/app/flags/${code}.png`;
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

  get quartiles(): [number, number, number]{
    return this._quartiles;
  }

  get isShowableTooltip(): boolean {
    return this._isShowableTooltip;
  }

  get demoCountriesData(): any {
    return this._demoCountriesData;
  }

  get tooltipPosition(): any {
    return this._tooltipPosition;
  }

  get tooltipInfo(): Tooltip {
    return this._tooltipInfo;
  }

  get allCountries(): Array<Country> {
    return this._allCountries;
  }

  get maxValue(): number {
    return this._maxValue;
  }

  get minValue(): number {
    return this._minValue;
  }

  get type(): string {
    return this._type;
  }

}
