import {Component, EventEmitter, Input, Output} from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Campaign } from '../../../../models/campaign';
import { SearchService } from '../../../../services/search/search.service';
import { TranslateNotificationsService } from '../../../../services/translate-notifications/translate-notifications.service';
import { RolesFrontService } from '../../../../services/roles/roles-front.service';
import {ErrorFrontService} from '../../../../services/error/error-front.service';

@Component({
  selector: 'app-shared-import-pros',
  templateUrl: './shared-import-pros.component.html',
})

export class SharedImportProsComponent {
  @Input() accessPath: Array<string> = [];

  @Input() campaign: Campaign = <Campaign>{};

  private _importingErrors: Array<any>;

  private _slicedErrors: Array<any> = [];

  private _errorsModal: boolean = false;

  private _importRequestKeywords = '';

  @Output() importFinished = new EventEmitter();

  constructor(private _searchService: SearchService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(
      this.accessPath.concat(path)
    );
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
            'Importing Error...',
            ErrorFrontService.getErrorKey(err.error));
          if (!!err.error.detailedMessage) {
            this._importingErrors = err.error.detailedMessage;
            this._slicedErrors = this._importingErrors.slice(0, 10);
            this._errorsModal = true;
          }
        }
      );
  }

  public onClickSeeMore() {
    const currentNumberOfErrors = this._slicedErrors.length;
    const end = currentNumberOfErrors + 10 > this._importingErrors.length ?
      this._importingErrors.length : currentNumberOfErrors + 10;
    this._slicedErrors = this._importingErrors.slice(0, end);
  }

  public closeModal(event: Event) {
    event.preventDefault();
    this.onImportFinished();
  }

  onImportFinished() {
    this.importFinished.emit();
    this._importingErrors = null;
    this._slicedErrors = null;
    //this._importingInfos = null;
    this._errorsModal = false;
  }

  get importingErrors(): any[] {
    return this._importingErrors;
  }

  get errorsModal(): boolean {
    return this._errorsModal;
  }

  set errorsModal(value: boolean) {
    this._errorsModal = value;
  }

  get slicedErrors(): Array<any> {
    return this._slicedErrors;
  }
  get importRequestKeywords(): string {
    return this._importRequestKeywords;
  }

  set importRequestKeywords(value: string) {
    this._importRequestKeywords = value;
  }
}
