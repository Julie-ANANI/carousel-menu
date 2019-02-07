import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-search-demo',
  templateUrl: './admin-search-demo.component.html',
  styleUrls: ['./admin-search-demo.component.scss']
})
export class AdminSearchDemoComponent {
  public continentTarget = {
    "americaSud": true,
    "americaNord": true,
    "europe": true,
    "russia": true,
    "asia": true,
    "oceania": true,
    "africa": true
  };
  public metadata: string = "world";

  public displayMetadata(continent: string) {
    this.metadata = continent;
  }
}
