import { Injectable } from '@angular/core';
import { FilterService } from './filters.service';
import {WorldmapService} from '../../../../../services/worldmap/worldmap.service';

@Injectable({providedIn: 'root'})
export class WorldmapFiltersService {

  private _selectedContinents: {[c: string]: boolean};

  constructor(private filterService: FilterService) {
    this.reset();
  }

  public reset() {
    this._selectedContinents = WorldmapService.continentsList.reduce((acc, cont) => {
      acc[cont] = true;
      return acc;
    }, {} as {[c: string]: boolean});
  }

  public selectContinent(continent: string, value: boolean) {
    this._selectedContinents[continent] = value;
    const remove = WorldmapService.areAllContinentChecked(this._selectedContinents);
    if (!remove) {
      this.filterService.addFilter(
        {
          status: 'COUNTRIES',
          value: this._selectedContinents,
          questionId: 'worldmap'
        }
      );
    } else {
      this.filterService.deleteFilter('worldmap');
    }
  }

  public selectContinents(event: {continents: {[continent: string]: boolean}, allChecked: boolean}): void {
    this._selectedContinents = event.continents;
    if (!event.allChecked) {
      this.filterService.addFilter(
        {
          status: 'COUNTRIES',
          value: event.continents,
          questionId: 'worldmap'
        }
      );
    } else {
      this.filterService.deleteFilter('worldmap');
    }

  }

  get selectedContinents(): {readonly [c: string]: boolean} {
    return this._selectedContinents;
  }

}
