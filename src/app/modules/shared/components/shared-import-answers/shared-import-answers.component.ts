import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
export class SharedImportAnswersComponent implements OnInit {

  @Input() accessPath: Array<string> = [];

  @Input() campaign: string = '';

  @Output() importingError: EventEmitter<any[]> = new EventEmitter<any[]>();

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
      .importAsCsv(this.campaign, file)
      .pipe(first())
      .subscribe(
        (message) => {
          this.importingError.emit(null)
          this._translateNotificationsService.success(
            'Success',
            'The answers has been imported.'
          );
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('Importing Error...', ErrorFrontService.getErrorKey(err.error));
          if(!!err.error.detailedMessage) {
            this.importingError.emit(err.error.detailedMessage);
          }
        }
      );
  }

}
