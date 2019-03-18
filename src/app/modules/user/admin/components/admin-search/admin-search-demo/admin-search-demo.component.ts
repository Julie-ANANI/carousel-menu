import { Component } from '@angular/core';
import { SearchService } from "../../../../../../services/search/search.service";
import { first } from "rxjs/operators";

@Component({
  selector: 'app-admin-search-demo',
  templateUrl: './admin-search-demo.component.html',
  styleUrls: ['./admin-search-demo.component.scss']
})
export class AdminSearchDemoComponent {

  private _keywords: string;
  private _pros: Array<any> = [];
  public modalUpdate = false;
  private _metadata: any = {};
  public continentTarget = {
    "americaSud": true,
    "americaNord": true,
    "europe": true,
    "russia": true,
    "asia": true,
    "oceania": true,
    "africa": true
  };

  constructor(private _searchService: SearchService) {}

  public searchPros(event: Event) {
    event.preventDefault();
    this._searchService.inHouseSearch(this._keywords).pipe(first()).subscribe((pros: any) => {
      this._pros = pros.map(pro => {
        pro.isLoading = true;
        return pro;
      });
      this._pros.forEach((pro, index) => {
        this.formatPro(pro, index);
      });
    });
  }

  public formatPro(pro, index) {
    if (!pro.person.company) {
      pro.person.company = {};
    }
    if (!pro.person.email) {
      // Si le pro n'a pas d'email, on en génère un faux (de toute façon il est flouté donc illisible)
      if(!pro.person.company.domain) {
        pro.person.company.domain = "unknown.com";
      }
      pro.person.email = `${pro.person.firstName.toLowerCase()}.${pro.person.lastName.toLowerCase()}@${pro.person.company.domain}`;
    }
    // On cherche le logo de la société via clearbit
    if(pro.person.company.domain && pro.person.company.domain != "unknown.com") {
      pro.person.company.logoUrl = `https://logo.clearbit.com/${pro.person.company.domain}?size=64`;
    }
    setTimeout(() => {
      pro.isLoading = false;
      this._pros[index] = pro;
    }, index * 120);
  }

  public totalAnimation(total) {
    total = total > 20000 ? 20000 : total;
    /*this._metadata.world = 0;
    for (let i = 0; i < total; i++) {
      setTimeout(this._metadata.world++, 5);
    }*/
    if (total < 100) this._metadata.world = "<50";
    if (total === 20000) this._metadata.world = "+" + total.toString();
  }

  public searchMetadata(event: Event) {
    event.preventDefault();
    this._searchService.metadataSearch(this._keywords).pipe(first()).subscribe((result: any) => {
      this._metadata = result.metadata;
      this.totalAnimation(this._metadata.world);

      this._pros = result.pros.map(pro => {
        pro.isLoading = true;
        return pro;
      });
      this._pros.forEach((pro, index) => {
        this.formatPro(pro, index);
      });
    });
  }

  public updateDatabase() {
    this._searchService.updateDatabase().pipe(first()).subscribe(_=> {
      console.log("OK");
    });
  }

  get metadata(): any { return this._metadata }
  get pros(): Array<any> { return this._pros }
  get keywords(): string { return this._keywords }
  set keywords(value: string) { this._keywords = value }
}
