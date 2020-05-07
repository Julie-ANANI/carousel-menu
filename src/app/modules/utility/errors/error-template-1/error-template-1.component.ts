import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-template-1',
  templateUrl: './error-template-1.component.html',
  styleUrls: ['./error-template-1.component.scss']
})

export class ErrorTemplate1Component {

  @Input() set errorMessage(value: string) {
    this._errorMessage = value;
  }

  private _defaultSrc = 'https://res.cloudinary.com/umi/image/upload/v1532678059/app/default-images/bot/error.svg';

  private _errorMessage: string;

  constructor() { }

  get defaultSrc(): string {
    return this._defaultSrc;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

}
