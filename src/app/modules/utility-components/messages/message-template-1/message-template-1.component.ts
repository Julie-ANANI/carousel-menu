import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-template-1',
  templateUrl: './message-template-1.component.html',
  styleUrls: ['./message-template-1.component.scss']
})

export class MessageTemplate1Component {

  @Input() set srcImage(value: string) {
    this._imageSrc = value;
  }

  @Input() set widthMax(value: string) {
    this._wrapperWidth = value;
  }

  @Input() set backgroundColor(value: string) {
    this._backgroundColor = value;
  }

  private _imageSrc = '';

  private _wrapperWidth = '';

  private _backgroundColor = '#4F5D6B';

  private _defaultSrc = 'https://res.cloudinary.com/umi/image/upload/v1542810328/app/default-images/bot/info.svg';

  constructor() { }

  get imageSrc(): string {
    return this._imageSrc;
  }

  get wrapperWidth(): string {
    return this._wrapperWidth;
  }

  get defaultSrc(): string {
    return this._defaultSrc;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

}
