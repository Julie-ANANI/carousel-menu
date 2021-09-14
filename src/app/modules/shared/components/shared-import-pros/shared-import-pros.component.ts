import { Component, Input } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Campaign } from '../../../../models/campaign';
import { SearchService } from '../../../../services/search/search.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-shared-import-pros',
  templateUrl: './shared-import-pros.component.html',
  styleUrls: ['./shared-import-pros.component.scss']
})

export class SharedImportProsComponent {
  @Input() campaign: Campaign = <Campaign>{};

  private _importRequestKeywords = '';


  constructor(private _searchService: SearchService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }


  get importRequestKeywords(): string {
    return this._importRequestKeywords;
  }

  set importRequestKeywords(value: string) {
    this._importRequestKeywords = value;
  }
  

  public onClickImport(file: File) {
    let fileName = this._importRequestKeywords;
    if (this.campaign) {
      fileName += `,${this.campaign._id},${this.campaign.innovation._id}`;
    }
    this._searchService
      .importList(file, fileName)
      .pipe(first())
      .subscribe(
        () => {
          this._translateNotificationsService.success(
            'Success',
            'The file is imported.'
          );
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            err.error.message
          );
          console.error(err);
        }
      );
  }
}
