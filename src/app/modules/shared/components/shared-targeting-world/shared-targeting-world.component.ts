import {Component, EventEmitter, Input, Output} from '@angular/core';
import { SharedWorldmapService } from '../shared-worldmap/services/shared-worldmap.service';
import { SharedTargetingWorldInterface } from './interfaces/shared-targeting-world-interface';

@Component({
  selector: 'app-shared-targeting-world',
  templateUrl: './shared-targeting-world.component.html',
  styleUrls: ['./shared-targeting-world.component.scss']
})

export class SharedTargetingWorldComponent {

  @Input() set continentsConfiguration(value: any) {
    console.log(value);
    this._initializeContinents(value);
  }

  @Output() dataChange: EventEmitter<SharedTargetingWorldInterface> = new EventEmitter<SharedTargetingWorldInterface>();

  continents: Array<string> = SharedWorldmapService.continentsList;

  showModal: boolean = false;

  targetingWorldData: SharedTargetingWorldInterface = {
    includeContinents: [],
    excludeContinents: []
  };

  constructor() { }

  private _initializeContinents(value: any) {
    for (const prop in value) {
      if (value.hasOwnProperty(prop)) {
        if (value[prop] && this.targetingWorldData.includeContinents.in) {
          this.targetingWorldData.includeContinents.push(prop);
        }
      }
      console.log(value[prop]);
    }
    console.log(this.targetingWorldData);
  }

  public onChangeContinentInclude(event: Event, continent: string) {

    if ((event.target as HTMLInputElement).checked) {
      this.targetingWorldData.includeContinents.push(continent)
    } else {
      this.targetingWorldData.includeContinents = this.targetingWorldData.excludeContinents.filter((value) => value !== continent);
    }

    this._emitChanges();
    console.log(this.targetingWorldData);
  }

  public onChangeContinentExclude(event: Event, continent: string) {

    if ((event.target as HTMLInputElement).checked) {
      this.targetingWorldData.excludeContinents.push(continent)
    } else {
      this.targetingWorldData.excludeContinents = this.targetingWorldData.excludeContinents.filter((value) => value !== continent);
    }

    this._emitChanges();
    console.log(this.targetingWorldData);
  }

  public checkContinent(continent: string, type: string): boolean {

    switch (type) {

      case 'include':
        return this.targetingWorldData.excludeContinents.some((value) => value === continent);

      case 'exclude':
        return this.targetingWorldData.includeContinents.some((value) => value === continent);

    }

  }

  public openModal(event: Event) {
    event.preventDefault();
    this.showModal = true;
  }

  private _emitChanges() {
    this.dataChange.emit(this.targetingWorldData);
  }

}
