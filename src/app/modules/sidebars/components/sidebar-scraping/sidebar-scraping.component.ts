import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import 'rxjs/add/operator/filter';

type Template = 'NEW_BATCH' | 'EDIT_BATCH' | '';

@Component({
  selector: 'app-sidebar-scraping',
  templateUrl: './sidebar-scraping.component.html',
  styleUrls: ['./sidebar-scraping.component.scss']
})

export class SidebarScrapingComponent implements OnChanges {

  @Input() content: any = <any>{};

  @Input() sidebarState = 'inactive';

  @Input() templateType: Template = '';

  @Input() params: any = null;

  @Output() paramsChange = new EventEmitter<any>();

  private _hideInput = false;

  // private _possibleFormattedAddress = new Array<string>();

  constructor() { }

  ngOnChanges(): void {
  }

  public saveParams(event: any) {
    console.log('UPDATED');
    event.preventDefault();
    this.paramsChange.emit(this.params);
  }

  public onKeyboardPress(event: Event) {
    event.preventDefault();
    this.paramsChange.emit(this.params);
  }

  public showField(index: number): boolean {
    return (index < this.params['numberFields']);
  }

  public showSpecificData(index: number): boolean {
    return (index < this.params['numberSpecificData']);
  }

  get hideInput(): boolean {
    return this._hideInput;
  }

  /*
  public updatePossibleFormattedAddress(): boolean {
    // Return true if there is a data on which it can apply formatted address
    // Update the _possibleFormattedAddress value
    this._possibleFormattedAddress = [];
    if (this.params['isSpecificData']) {
      for (let index = 0; index < this.params['numberSpecificData']; index++) {
        const name = this.params['specificData'][index]['name'];
        if (name !== '') {
          this._possibleFormattedAddress.push(name);
        }
      }
    }
    if (this.params['rawData']) {
      this._possibleFormattedAddress.push('raw data');
    }
    return (this._possibleFormattedAddress !== []);
  }
   */

  public possibleFormattedAddress(): Array<string> {
    const possible = [];
    if (this.params['isSpecificData']) {
      for (let index = 0; index < this.params['numberSpecificData']; index++) {
        const name = this.params['specificData'][index]['name'];
        if (name !== '' && typeof name !== 'undefined') {
          possible.push(name);
        }
      }
    }
    if (this.params['rawData']) {
      possible.push('raw data');
    }
    return possible;
  }

}
