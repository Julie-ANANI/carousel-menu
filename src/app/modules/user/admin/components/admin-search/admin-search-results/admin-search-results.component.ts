import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-search-results',
  template:
    `
      <app-shared-search-results></app-shared-search-results>

    `
})
export class AdminSearchResultsComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }
}
