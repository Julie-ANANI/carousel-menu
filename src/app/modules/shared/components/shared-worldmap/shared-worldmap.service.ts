import { /*ComponentFactoryResolver, Inject,*/ Injectable, ViewContainerRef } from '@angular/core';
// import { SharedWorldmapComponent } from './shared-worldmap.component';

const continents = [
  'africa',
  'americaNord',
  'americaSud',
  'asia',
  'europe',
  'oceania',
  'russia'
];

@Injectable()
export class SharedWorldmapService {

  private _viewContainer: ViewContainerRef;

  constructor(/*@Inject(ComponentFactoryResolver) private _factoryResolver*/) {}

  public setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this._viewContainer = viewContainerRef;
  }

  /*
   * Return a concatened list of all the countries inside the selected continents.
   * TODO: add memoization to avoid running always the same costly calls to the DOM (ngrx/store ?)
   */
  public getCountriesList(continentsToExplore: {[continent: string]: boolean}): Array<string> {
    const countries_list: Array<string> = [];
    continents.forEach((continent) => {
      if (continentsToExplore[continent]) {
        const continent_elems = this._viewContainer.element.nativeElement.getElementsByClassName(continent);
        Array.prototype.forEach.call(continent_elems, (continent_el: HTMLElement) => {
          const countries_elems = continent_el.getElementsByTagName('path');
          Array.prototype.forEach.call(countries_elems, (country_el: HTMLElement) => {
            countries_list.push(...country_el.getAttribute('class').split(' '));
          });
        });
      }
    });
    return countries_list;
  }

  /*
   * Return the repartition of the countries within the continents.
   */
  public getCountriesRepartition(countries: Array<string>): {[continent: string]: number} {
    return countries.reduce((acc, country) => {
      // const country_elems = this._viewContainer.element.nativeElement.getElementsByClassName(country);
      const continent = country;
      acc[continent] = acc[continent] + 1;
      return acc;
    }, {});
  }

}
