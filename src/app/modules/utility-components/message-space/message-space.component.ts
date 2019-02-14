import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-space',
  templateUrl: './message-space.component.html',
  styleUrls: ['./message-space.component.scss']
})

export class MessageSpaceComponent {

  @Input() set messageA(value: string) {
    this._firstLine = value;
  }

  @Input() set messageB(value: string) {
    this._secondLine = value;
  }

  @Input() set srcImage(value: string) {
    this._imageSrc = value;
  }

  @Input() set widthMax(value: string) {
    this._wrapperWidth = value;
  }

  private _firstLine = '';

  private _secondLine = '';

  private _imageSrc = '';

  private _wrapperWidth = '';

  private _defaultSrc = 'https://res.cloudinary.com/umi/image/upload/v1542810328/app/default-images/bot/info.svg';

  constructor() { }

  get firstLine(): string {
    return this._firstLine;
  }

  get secondLine(): string {
    return this._secondLine;
  }

  get imageSrc(): string {
    return this._imageSrc;
  }

  get wrapperWidth(): string {
    return this._wrapperWidth;
  }

  get defaultSrc(): string {
    return this._defaultSrc;
  }

}
