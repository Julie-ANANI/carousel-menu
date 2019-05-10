import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bluesquare',
  templateUrl: 'bluesquare.component.html',
  styleUrls: ['bluesquare.component.scss']
})

export class BluesquareComponent {

  @Input() set numberFocus(value: number) {
    this._numberFocus = value;
  }

  @Input() set subtitle(value: string) {
    this._subtitle = value;
  }

  @Input() set percentage(value: number) {
    this._percentage = value;
  }

  private _numberFocus: number;

  private _subtitle: string;

  private _percentage: number;

  constructor() {}

  get numberFocus(): number {
    return this._numberFocus;
  }

  get subtitle(): string {
    return this._subtitle;
  }

  get percentage(): number {
    return this._percentage;
  }

}
