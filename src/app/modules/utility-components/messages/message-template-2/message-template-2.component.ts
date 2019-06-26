import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-template-2',
  templateUrl: './message-template-2.component.html',
  styleUrls: ['./message-template-2.component.scss']
})

export class MessageTemplate2Component {

  @Input() set srcImage(value: string) {
    this._imageSrc = value;
  }

  private _imageSrc = '';

  private _defaultSrc = 'https://res.cloudinary.com/umi/image/upload/v1542810328/app/default-images/bot/info.svg';

  constructor() { }

  get imageSrc(): string {
    return this._imageSrc;
  }

  get defaultSrc(): string {
    return this._defaultSrc;
  }

}
