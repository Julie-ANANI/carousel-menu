import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeographySettings } from '../../../../models/innov-settings';

@Component({
  selector: 'app-sidebar-search',
  templateUrl: './sidebar-search.component.html',
  styleUrls: ['./sidebar-search.component.scss'],
})
export class SidebarSearchComponent {
  @Input() isEditable = false;

  @Input() params: any = null;

  @Input() geography: GeographySettings = <GeographySettings>{};

  @Output() paramsChange = new EventEmitter<any>();

  @Output() geographyChange = new EventEmitter<any>();

  private _prosCount: Array<string> = ['10', '20', '30', '40', '50', '100'];

  private _showToggleSearch = false;

  constructor() {}

  public saveParams(event: any) {
    event.preventDefault();
    if (this.isEditable) {
      this.paramsChange.emit(this.params);
      this.geographyChange.emit(this.geography);
    }
  }

  get prosCount(): Array<string> {
    return this._prosCount;
  }

  get showToggleSearch(): boolean {
    return this._showToggleSearch;
  }

  onClickToggle() {
    this._showToggleSearch = !this._showToggleSearch;
  }
}
