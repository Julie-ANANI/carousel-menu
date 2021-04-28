import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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

  private _colors = [
    {label: 'red', value: '#EA5858'},
    {label: 'orange', value: '#F89424'},
    {label: 'lightgreen', value: '#99E04B'},
    {label: 'green', value: '#2ECC71'},
    {label: 'neutral-1', value: '#dde3ea'},
    {label: 'neutral-2', value: '#bbc7d6'},
    {label: 'neutral-3', value: '#ffcc6e'},
    {label: 'neutral-4', value: '#ffb300'},
    {label: 'neutral-5', value: '#3a78a8'},
    {label: 'neutral-6', value: '#2e6188'},
  ];

  private _displayedColors = this._colors;

  ngOnInit() {
    if (this.nbColors <= 4) {
      this._displayedColors = this._colors.slice(0, 4);
    } else if (this.nbColors <= 6) {
      this._displayedColors = this._colors.slice(4, 10);
    } else {
      this._displayedColors = this._colors;
    }
  }

  changeColor(event: any) {
    event.preventDefault();
    this._selectedColor = event.srcElement.value;
    this.colorChanged.emit(this.selectedColor);
  }

  get selectedColor(): string {
    return this._selectedColor;
  }

  get displayedColors(): ({ label: string; value: string })[] {
    return this._displayedColors;
  }
}
