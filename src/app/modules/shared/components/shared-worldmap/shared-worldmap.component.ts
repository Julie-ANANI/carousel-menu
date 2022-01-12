import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewContainerRef,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { WorldmapService } from '../../../../services/worldmap/worldmap.service';
import { Country } from '../../../../models/country';
import {isPlatformBrowser} from '@angular/common';

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

  @Input() countriesColor = '#2ECC71';

  @Input() isShowableQuartiles = true;

  @Input() type = 'default';

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
  @Input() maxValue: number;

  /***
   * Below this value, we display < 10
   * instead of the true value.
   * @param value
   */
  @Input() minValue: number;

  /***
   * use this when with the list of countries you have the data
   * and base on that data you want to paint the map.
   * @param value
   */
  @Input() set countriesData (value: any) {
    this._countriesData = value;
    this._initializeTemplate();
  }

  @Output() onCountryClick: EventEmitter<string> = new EventEmitter<string>();

  private _showLegend = false;

  private _firstThreshold: number;

  private _secondThreshold: number;

  private _quartiles: [number, number, number];

  private _isShowableTooltip = false;

  private _tooltipPosition: any = {};

  private _tooltipInfo: Tooltip = null; // it has country code, name and value of it.

  private _allCountries: Array<Country> = [];

  private _countriesData: any;

  @HostListener('click', ['$event'])
  onMouseClick(event: MouseEvent) {
    if (this.type === 'demo') {
      const id = (event.target as HTMLElement).id;
      if (id && id !== 'shared-worldmap') {
        this.onCountryClick.emit(id);
      }
    }
  }

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _elementRef: ElementRef,
              private _worldmapService: WorldmapService,
              private _viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this._worldmapService.loadCountriesFromViewContainerRef(this._viewContainerRef);
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

  private _getAllCountries() {
    if (isPlatformBrowser(this._platformId)) {
      this._worldmapService.getCountriesList().then(response =>{
        this._allCountries = response;
      })
    }
  }

  private _initializeTemplate() {
    switch (this.type) {

      case 'demo':
        this._setCountryColor();
        break;

      case 'default':
        this._calculateDefaultData();
        break;

    }
  }

  private _setCountryColor() {
    if (this._countriesData) {
      this._reinitializeMap();

      for (const key in this._countriesData) {
        if (this._countriesData.hasOwnProperty(key)) {
          if (this._countriesData[key] >= this._quartiles[2]) {
            this._colorCountry(key, '#39CB74');
          } else if (this._countriesData[key] >= this._quartiles[1]) {
            this._colorCountry(key, '#9BDE56');
          } else if (this._countriesData[key] >= this._quartiles[0]) {
            this._colorCountry(key, '#97E8B9');
          }
        }
      }

    }
  }

  private _calculateDefaultData() {
    this._showLegend = true;

    // First we create an array with all the values, without doublons
    const valuesSet = new Set();
    // tslint:disable-next-line:forin
    for (const key in this._countriesData) {
      valuesSet.add(this._countriesData[key]);
    }

    const results: Array<any> = Array.from(valuesSet).sort((a: any, b: any) => a - b);

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
          const sdcmAll = groups.reduce((sum, curr) => sum + getSquaredDeviation(curr), 0);
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
        if (optimalGroups.length === 3) {
          this._firstThreshold = optimalGroups[1][0];
        } else {
          this._firstThreshold = optimalGroups[0][optimalGroups[0].length - 1];
        }
      }
    }

    this._reinitializeMap();

    // tslint:disable-next-line:forin
    for (const country in this._countriesData) {
      const color = this._countriesData[country] < this._firstThreshold ? '#97E8B9' : this._countriesData[country] < this._secondThreshold ? '#9BDE56' : '#39CB74';
      this._colorCountry(country, color);
    }

  }

  // TODO look into layerX
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this._isShowableTooltip) {
      const id = (event.target as HTMLElement).id;

      if (id) {
        this._setTooltipInfo(id);
        let leftPosition;

        if (document.documentElement.clientWidth - event.clientX > 200) {
          leftPosition = `${event.clientX - (event.clientX - event['layerX']) - 3}px`;
        } else {
          leftPosition =  `${event['layerX'] - 180}px`;
        }

        this._tooltipPosition = {
          left: leftPosition,
          top: `${event['layerX'] + 25}px`,
          opacity: 1,
          display: 'block'
        };

      } else {
        this._tooltipPosition = {
          opacity: 0,
          display: 'none'
        };
      }

    }
  }

  private _setTooltipInfo(countryId: string) {
    switch (this.type) {

      case 'demo':
        this._demoTooltip(countryId);
        break;

    }
  }

  private _demoTooltip(countryId: string) {
    const _country = this._allCountries.find((country) => country.code === countryId);
    const code = _country ? _country.code : '';
    const name = _country ? _country.name : 'NA';
    let value = this._countriesData[code] || 'NA';

    if (this.minValue && (value || value === 0) && value <= this.minValue) {
      value = '< ' + this.minValue;
    } else if (this.minValue && (value || value === 0) && value >= this.maxValue) {
      value = '> ' + this.maxValue;
    }

    this._tooltipInfo = {
      flag: code,
      name: name,
      value: value
    };

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

  get quartiles(): [number, number, number] {
    return this._quartiles;
  }

  get isShowableTooltip(): boolean {
    return this._isShowableTooltip;
  }

  get tooltipPosition(): any {
    return this._tooltipPosition;
  }

  get tooltipInfo(): Tooltip {
    return this._tooltipInfo;
  }

}
