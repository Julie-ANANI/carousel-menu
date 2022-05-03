import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {RolesFrontService} from "../../../../services/roles/roles-front.service";
import {TranslateNotificationsService} from "../../../../services/translate-notifications/translate-notifications.service";
import {first} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {ErrorFrontService} from "../../../../services/error/error-front.service";
import {AnswerService} from "../../../../services/answer/answer.service";

@Component({
  selector: 'app-shared-import-answers',
  templateUrl: './shared-import-answers.component.html'
})
export class SharedImportAnswersComponent implements OnInit, OnDestroy {

  @Input() accessPath: Array<string> = [];

  @Input() campaign: string = '';

  private _importingErrors: Array<any>;

  private _slicedErrors: Array<any> = [];

  private _importingInfos: { nbExistingAnswers: number; nbNewAnswers: number; newTags: [] };

  private _file: File;

  private _errorsModal: boolean = false;

  @Output() importFinished = new EventEmitter();

  constructor(private _answerService: AnswerService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }

  ngOnInit(): void {
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(
      this.accessPath.concat(path)
    );
  }

  public onClickImport(file: File) {
    this._answerService
      .checkImportAsCsv(this.campaign, file)
      .pipe(first())
      .subscribe(
        (message: { nbExistingAnswers: number, nbNewAnswers: number, newTags: []}) => {
          this._importingInfos = message;
          this._file = file;
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('Importing Error...', ErrorFrontService.getErrorKey(err.error));
          if (!!err.error.detailedMessage) {
            this._importingErrors = err.error.detailedMessage;
            this._slicedErrors = this._importingErrors.slice(0, 10);
            this._errorsModal = true;
          }
        }
      );
  }

  public onConfirmImport() {
    if (this._file) {
      this._answerService
        .importAsCsv(this.campaign, this._file)
        .pipe(first())
        .subscribe(
          () => {
            this.onImportFinished();
            this._translateNotificationsService.success('Success', `Answers imported`);
          },
          (err: HttpErrorResponse) => {
            this.onImportFinished();
            this._translateNotificationsService.error('Importing Error...', ErrorFrontService.getErrorKey(err.error));
          }
        );
    }
    this.onImportFinished();
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
    this.importFinished.emit()
    this._importingErrors = null;
    this._slicedErrors = null;
    this._importingInfos = null;
    this._errorsModal = false;
  }

  get importingInfos(): { nbExistingAnswers: number; nbNewAnswers: number; newTags: [] } {
    return this._importingInfos;
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

  ngOnDestroy(): void {
    this.onImportFinished();
  }
}
