import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'spinner-loader',
  templateUrl: './spinner-loader.component.html',
  styleUrls: ['./spinner-loader.component.scss']
})

export class SpinnerLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getLogo(): string {
    return environment.logoURL;
  }

  getDomain(): string {
    return environment.domain;
  }

}
