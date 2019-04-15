import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-spinner-loader',
  templateUrl: './spinner-loader.component.html',
  styleUrls: ['./spinner-loader.component.scss']
})

export class SpinnerLoaderComponent {

  constructor() { }

  getLogo(): string {
    return environment.logoURL;
  }

  getDomain(): string {
    return environment.domain;
  }

}
