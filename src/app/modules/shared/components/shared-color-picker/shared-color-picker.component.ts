import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {colors} from '../../../../utils/chartColors';

@Component({
  selector: 'app-shared-color-picker',
  templateUrl: './shared-color-picker.component.html',
  styleUrls: ['./shared-color-picker.component.scss']
})
export class SharedColorPickerComponent implements OnInit {

  @Input() color: string;
  @Input() nbColors = 4;
  @Output() colorChanged = new EventEmitter<string>();

  public toggleCustomColorPicker = false;

  private _customColor = '';

  constructor() {
  }

  public colors = colors;

  ngOnInit() {
    this.customColor = (!this.colors.some(c => c.value === this.color)) ? this.color : this.customColor;
  }

  toggleCustomColor() {
    this.customColor = (!this.customColor) ? this.color : this.customColor;
    this.toggleCustomColorPicker = true;
  }

  changeColor(event: any) {
    event.preventDefault();
    this.colorChanged.emit(event.srcElement.value);
  }

  get customColor(): string {
    return this._customColor;
  }

  set customColor(value: string) {
    this._customColor = value;
  }
}
