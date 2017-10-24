import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-loader',
  template: '<div class="loading loading-lg"></div>'
})
export class SharedLoaderComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
