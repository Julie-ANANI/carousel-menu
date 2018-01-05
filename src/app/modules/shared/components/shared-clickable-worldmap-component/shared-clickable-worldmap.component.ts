/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'clickable-worldmap',
  templateUrl: 'shared-clickable-worldmap.component.html',
  styleUrls: ['shared-clickable-worldmap.component.scss']
})

export class SharedClickableWorldmapComponent implements OnInit {

  @Input() public canEdit: boolean;
  @Output() public notifier = new EventEmitter<any>();

  @Input()
  set initialConfiguration(initialConfiguration: any) {
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

  private _continents = {
    africa: false,
    americaNord: false,
    americaSud: false,
    asia: false,
    europe: false,
    oceania: false,
    russia: false
  };


  constructor() { }

  ngOnInit() {

  }
  /**
   * Checks whether all the continents have been selected
   * @returns {boolean}
   */
  public areAllContinentChecked(): boolean {
    const keys = Object.keys(this._continents);
    let i = 0;
    while(i < keys.length && this._continents[keys[i]]) {
      i++;
    }
    return i === keys.length;
  }

  /**
   * Selects/Unselects all the countries
   * @param $event the value of the checkbox
   */
  public switchWorldCheckbox($event): void {
    const worldCheckboxValue = $event.target.checked;
    const keys = Object.keys(this._continents);
    keys.forEach(continent=>{
      this._continents[continent] = worldCheckboxValue;
    });
    this.notifier.emit({continents: this._continents});
  }

  /**
   * Processes the click over one continent
   * @param continent
   */
  public clickOnContinent(continent): void {
    this._continents[continent] = !this._continents[continent];
    this.notifier.emit({continents: this._continents});
  }

  /**
   * Indicates selection status of a continent
   * @param continent the continent to test
   * @returns {boolean}
   */
  public getContinentSelectionStatus(continent): boolean {
    return !!this._continents[continent];
  }


}
