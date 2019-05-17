import { Component } from '@angular/core';

@Component({
  selector: 'app-fetching-error',
  templateUrl: './fetching-error.component.html',
  styleUrls: ['./fetching-error.component.scss']
})

export class FetchingErrorComponent {

  private _defaultSrc = 'https://res.cloudinary.com/umi/image/upload/v1532678059/app/default-images/bot/error.svg';

  constructor() { }

  get defaultSrc(): string {
    return this._defaultSrc;
  }

}
