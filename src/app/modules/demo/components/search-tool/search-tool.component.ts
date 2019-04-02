import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { Professional } from '../../../../models/professional';
import { SearchService } from '../../../../services/search/search.service';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-search-tool',
  templateUrl: './search-tool.component.html',
  styleUrls: ['./search-tool.component.scss']
})

export class SearchToolComponent implements OnInit{

  searchForm: FormGroup;

  professional: Array<Professional> = [];

  continentTarget = {
    "americaSud": true,
    "americaNord": true,
    "europe": true,
    "russia": true,
    "asia": true,
    "oceania": true,
    "africa": true
  };

  metadata: any = {};

  noResult = true;

  searchStarted = false;

  searchStopped = false;

  constructor(private _translateTitleService: TranslateTitleService,
              private _formBuilder: FormBuilder,
              private _searchService: SearchService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._translateTitleService.setTitle('Search Tool | UMI');

  }

  ngOnInit(): void {
    this._buildForm();
  }


  private _buildForm() {
    this.searchForm = this._formBuilder.group({
      keywords: [''],
    });
  }


  public onClickSearch() {
    const keywords = this.searchForm.get('keywords').value;

    if (keywords) {
      this.professional = [];
      this.metadata = {};

      this._searchService.metadataSearch(keywords).pipe(first()).subscribe((result: any) => {
        this.searchStarted = true;

        setTimeout(() => {
          this.noResult = false;
          this.searchStopped = true;
        }, 2005);

        this.metadata = result.metadata || {};

      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });


    }

  }


}
