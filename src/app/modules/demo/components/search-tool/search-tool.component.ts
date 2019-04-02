import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { Professional } from '../../../../models/professional';
import { SearchService } from '../../../../services/search/search.service';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { SearchTool } from '../../../../models/search-tool';

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

  metadata: SearchTool = {};

  noResult = true;

  searchStarted = false;

  searchContinue = false;

  searchStopped = false;

  professionalCount: number = 0;

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

    console.log(keywords);
    console.log(this.metadata);

    if (keywords) {
      this.professional = [];
      this.metadata = {};

      this._searchService.metadataSearch(keywords).pipe(first()).subscribe((result: any) => {
        this.searchStarted = true;
        this.searchStopped = false;
        this.metadata = result.metadata || {};

        console.log(this.metadata);

        setTimeout(() => {
          this.noResult = false;
          this.searchContinue = true;
          this._totalProfessional(this.metadata.world);
        }, 2005);

      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });


    }

  }


  private _totalProfessional(total: number) {
    total = total > 20000 ? 20000 : total < 100 ? 50 : total;
    let duration = 2000 / total;
    let increment = 1;
    this.professionalCount = 0;

    if (duration < 1) {
      increment = Math.round(1/duration);
      duration = 1;
    }

    const self = this;

    const interval = setInterval(() => {
      if ( self.professionalCount >= total) {
        this.searchStopped = true;
        clearInterval(interval);
      }
      else  {
        self.professionalCount + increment > total ? self.professionalCount = total : self.professionalCount += increment;
      }
    }, duration);

  }


}
