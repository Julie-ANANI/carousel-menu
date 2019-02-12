import { Component } from '@angular/core';
import { SearchService } from "../../../../../../services/search/search.service";
import { TranslateNotificationsService } from "../../../../../../services/notifications/notifications.service";
import { COUNTRIES } from '../../../../../shared/components/shared-search-pros/COUNTRIES';
import {first} from "rxjs/operators";

@Component({
  selector: 'app-admin-search-demo',
  templateUrl: './admin-search-demo.component.html',
  styleUrls: ['./admin-search-demo.component.scss']
})
export class AdminSearchDemoComponent {

  private _keywords: string;
  private _metadata: any;
  private _results: any;
  private _fetchInterval = null;
  private _status: string = null;
  public continentTarget = {
    "americaSud": true,
    "americaNord": true,
    "europe": true,
    "russia": true,
    "asia": true,
    "oceania": true,
    "africa": true
  };
  private _selectedArea: string = "world";

  constructor(private _searchService: SearchService,
              private _notificationsService: TranslateNotificationsService) {}

  public displayMetadata(continent: string) {
    this._selectedArea = continent;
    this._results = continent === 'world' ?
      this._metadata :
      this._metadata.filter(result => COUNTRIES[continent].indexOf(result.countryCode) > -1);
  }

  public searchMetadata(event: Event) {
    event.preventDefault();
    this._searchService.metadataSearch(this._keywords).pipe(first()).subscribe((request: any) => {
      this._status = request.status;
      this._notificationsService.success('Requête ajoutée', 'La requête a bien été ajoutée à la file d\'attente');
      this._fetchInterval = setInterval(() => this.fetchRequest(request._id), 3000);
    });
  }

  public fetchRequest(requestId: string) {
    this._searchService.getMetadataRequest(requestId).pipe(first()).subscribe((request: any) => {
      console.log(request);
      this._status = request.status;
      this._metadata = request.metadata;
      if (this._status === "DONE") {
        clearInterval(this._fetchInterval);
      }
    });
  }

  get selectedArea(): string { return this._selectedArea }
  get status(): string { return this._status }
  get results(): string { return this._results }
  get keywords(): string { return this._keywords }
  set keywords(value: string) { this._keywords = value }
}
