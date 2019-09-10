import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { SharedWorldmapService } from './services/shared-worldmap.service';

@Component({
  selector: 'app-worldmap',
  templateUrl: 'shared-worldmap.component.html',
  styleUrls: ['shared-worldmap.component.scss']
})

export class SharedWorldmapComponent implements OnInit{

  @Input() width = '800px';

  @Input() countriesColor: string;

  @Input() isEditable = true;

  @Input() synthesis = false;

  @Input() set countries(value: Array<string>) {
    /*
     * TODO: Has anyone thought about how to remove a country from the list ?
     */
    if (Array.isArray(value) && value.length > 0 && !this.countriesData) {
      value.forEach((country) => {
        const country_elems = this._elem.nativeElement.getElementsByClassName(country);
        if (country_elems && country_elems.length) {
          Array.prototype.forEach.call(country_elems, (country_el: HTMLElement) => {
            country_el.style.fill = this.countriesColor;
          });
        } else {
          console.log(`This country is nowhere to be found in the svg map ${country}`);
        }
      });
    }
  }

  @Input() set countriesData(countries: any) {
    this.showLegend = true;

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

    for (let country in countries) {
      const color = countries[country] < this._firstThreshold ? "#97E8B9" : countries[country] < this._secondThreshold ? "#9BDE56" : "#39CB74";
      const country_elems = this._elem.nativeElement.getElementsByClassName(country);
      if (country_elems && country_elems.length) {
        Array.prototype.forEach.call(country_elems, (country_el: HTMLElement) => {
          country_el.style.fill = color;
        });
      } else {
        console.log(`This country is nowhere to be found in the svg map ${country}`);
      }
    }
  }

  @Input() set initialConfiguration(initialConfiguration: {[c: string]: boolean}) {
    this._continents = initialConfiguration || {
      africa: false,
      americaNord: false,
      americaSud: false,
      asia: false,
      europe: false,
      oceania: false,
      russia: false
    };
  }

  @Output() updateContinent = new EventEmitter<any>();

  @Output() hoveredContinent = new EventEmitter<string>();

  public showLegend: boolean = false;

  private _firstThreshold: number;
  private _secondThreshold: number;

  /* Initialise continents selections with everything to false */
  private _continents = SharedWorldmapService.continentsList.reduce((acc, cont) => {
    acc[cont] = false;
    return acc;
  }, {} as any);

  constructor(private _elem: ElementRef,
              private _worldmap: SharedWorldmapService,
              private _viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this._worldmap.loadCountriesFromViewContainerRef(this._viewContainerRef);
  }


  /**
   * Checks whether all the continents have been selected
   * @returns {boolean}
   */
  public areAllContinentChecked(): boolean {
    const keys = Object.keys(this._continents);
    let i = 0;
    while (i < keys.length && this._continents[keys[i]]) {
      i++;
    }
    return i === keys.length;
  }


  /**
   * Selects/Unselects all the countries
   * @param $event the value of the checkbox
   */
  public switchWorldCheckbox($event: any): void {
    const worldCheckboxValue = $event.target.checked;
    SharedWorldmapService.continentsList.forEach((continent) => {
      this._continents[continent] = worldCheckboxValue;
    });
  }


  /**
   * Processes the click over one continent
   * @param continent
   */
  public clickOnContinent(event: Event, continent: string): void {
    event.preventDefault();
    if (this.isEditable) {
      this._continents[continent] = !this._continents[continent];
      this.updateContinent.emit({
        continents: this._continents,
        allChecked: SharedWorldmapService.areAllContinentChecked(this._continents)
      });
    }
  }


  /**
   * Indicates selection status of a continent
   * @param continent the continent to test
   * @returns {boolean}
   */
  public getContinentSelectionStatus(continent: string): boolean {
    return !!this._continents[continent];
  }


  public onHoverChange(continent: string): void {
    this.hoveredContinent.emit(continent);
  }

  get firstThreshold(): number {
    return this._firstThreshold;
  }

  get secondThreshold(): number {
    return this._secondThreshold;
  }
}
