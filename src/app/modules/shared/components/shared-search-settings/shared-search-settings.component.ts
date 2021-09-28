import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-search-settings',
  templateUrl: './shared-search-settings.component.html',
  styleUrls: ['./shared-search-settings.component.scss'],
})
export class SharedSearchSettingsComponent {
  @Input() isEditable = false;

  @Input() params: any = null;

  @Output() paramsChange = new EventEmitter<any>();

  private _prosCount: Array<string> = ['10', '20', '30', '40', '50', '100'];

  private _showToggleSearch = false;

  constructor() {}

  public saveParams() {
    if (this.isEditable) {
      this.paramsChange.emit(this.params);
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
