import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {colors} from '../../../../utils/chartColors';

@Component({
  selector: 'app-shared-color-picker',
  templateUrl: './shared-color-picker.component.html',
  styleUrls: ['./shared-color-picker.component.scss']
})
export class SharedColorPickerComponent implements OnInit {

  @Input() nbColors = 4;
  @Output() colorChanged = new EventEmitter<string>();

  constructor() {
  }

  private _selectedColor: string; // color hex code

  public colors = colors;

  ngOnInit() {

  }

  changeColor(event: any) {
    event.preventDefault();
    this._selectedColor = event.srcElement.value;
    this.colorChanged.emit(this.selectedColor);
  }

  get selectedColor(): string {
    return this._selectedColor;
  }
}
