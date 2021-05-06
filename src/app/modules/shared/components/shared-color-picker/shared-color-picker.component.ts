import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {colors} from '../../../../utils/chartColors';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-shared-color-picker',
  templateUrl: './shared-color-picker.component.html',
  styleUrls: ['./shared-color-picker.component.scss']
})
export class SharedColorPickerComponent implements OnInit {

  @Input() color: string;
  @Input() nbColors = 4;
  @Input() reportingLang = this._translateService.currentLang;
  @Output() colorChanged = new EventEmitter<string>();

  public toggleCustomColorPicker = false;

  private _customColor = '';
  private _selectedColor = '';

  constructor(private _translateService: TranslateService) {
  }

  public colors = colors;

  ngOnInit() {
    this._selectedColor = this.color;
    this._customColor = (!this.colors.some(c => c.value === this.color)) ? this.color : this.customColor;
  }

  toggleCustomColor() {
    this._customColor = (!this.customColor) ? 'black' : this.customColor;
    this._selectedColor = this._customColor;
    this.toggleCustomColorPicker = true;
  }

  changeColor(event: any) {
    event.preventDefault();
    this._selectedColor = event.srcElement.value;
  }

  get customColor(): string {
    return this._customColor;
  }

  set customColor(value: string) {
    this._customColor = value;
  }

  get selectedColor(): string {
    return this._selectedColor;
  }

  set selectedColor(value: string) {
    this._selectedColor = value;
  }
}
