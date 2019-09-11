import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { SharedWorldmapService } from '../shared-worldmap/services/shared-worldmap.service';
import { SharedTargetingWorldInterface } from './interfaces/shared-targeting-world-interface';
import { IndexService } from '../../../../services/index/index.service';

@Component({
  selector: 'app-shared-targeting-world',
  templateUrl: './shared-targeting-world.component.html',
  styleUrls: ['./shared-targeting-world.component.scss']
})

export class SharedTargetingWorldComponent implements OnInit {

  @Input() set continentsConfiguration(value: any) {
    console.log(value);
    this._initializeContinents(value);
  }

  @Input() isEditable: boolean = true;

  @Input() isAdmin: boolean = false;

  @Output() dataChange: EventEmitter<SharedTargetingWorldInterface> = new EventEmitter<SharedTargetingWorldInterface>();

  continents: Array<string> = SharedWorldmapService.continentsList;

  showModal: boolean = false;

  targetingWorldData: SharedTargetingWorldInterface = {
    includeContinents: [],
    excludeContinents: []
  };

  constructor(private _indexService: IndexService) { }

  ngOnInit() {
    this._indexService.getWholeSet({ type: 'countries', fields: [], filterBy: '' }).subscribe((event) => {
      console.log(event);
    });

  }

  private _initializeContinents(value: any) {
    for (const prop in value) {
      if (value.hasOwnProperty(prop)) {

        if (value[prop]) {
          if (!this.targetingWorldData.includeContinents.some((existCont) => existCont === prop)) {
            this.targetingWorldData.includeContinents.push(prop);
          }
        }

      }
    }
  }

  public autoCompleteConfig(type: string): any {
    switch (type) {

      case 'exclude':
        return {
          placeholder: 'SHARED_TARGETING_WORLD.PLACEHOLDER.TO_EXCLUDE_COUNTRY',
          //initialData: this._innovation.settings && this._innovation.settings.geography ? this._innovation.settings.geography.exclude || [] : [],
          type: 'countries'
        };

      case 'include':
        return {
          placeholder: 'SHARED_TARGETING_WORLD.PLACEHOLDER.TO_INCLUDE_COUNTRY',
          //initialData: this._innovation.settings && this._innovation.settings.geography ? this._innovation.settings.geography.exclude || [] : [],
          type: 'countries'
        };

    }
  }

  public onChangeContinentInclude(event: Event, continent: string) {
    if (this.isEditable) {
      if ((event.target as HTMLInputElement).checked) {
        this.targetingWorldData.includeContinents.push(continent)
      } else {
        this.targetingWorldData.includeContinents = this.targetingWorldData.includeContinents.filter((value) => value !== continent);
      }

      this._emitChanges();
    }
    console.log(this.targetingWorldData);
  }

/*  public onChangeContinentExclude(event: Event, continent: string) {
    if (this.isEditable) {

      if ((event.target as HTMLInputElement).checked) {
        this.targetingWorldData.excludeContinents.push(continent)
      } else {
        this.targetingWorldData.excludeContinents = this.targetingWorldData.excludeContinents.filter((value) => value !== continent);
      }

      this._emitChanges();
    }
    console.log(this.targetingWorldData);
  }*/

  public checkContinent(continent: string, type: string): boolean {

    switch (type) {

      case 'include':
        return this.targetingWorldData.includeContinents.some((value) => value === continent);

      case 'exclude':
        return this.targetingWorldData.excludeContinents.some((value) => value === continent);

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
