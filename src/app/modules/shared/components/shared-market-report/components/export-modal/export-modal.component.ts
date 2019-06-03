import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Share } from '../../../../../../models/share';
import { environment } from '../../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ShareService } from '../../../../../../services/share/share.service';

export enum ExportType { csv = 'csv', executiveReport = 'executiveReport', respReport = 'respReport', shareReport = 'shareReport' }

@Component({
  selector: 'app-market-report-export-modal',
  templateUrl: 'export-modal.component.html',
  styleUrls: ['export-modal.component.scss']
})

export class ExportModalComponent {

  @Input() set showModal(value: boolean) {
    this._showExportModal = value;
  }

  @Input() set innovation(value: Innovation) {
    this._needConsent = (!!value.ownerConsent && !value.ownerConsent.value) || !this._authService.isAdmin;
    this._innovation = value;
  }

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _exportType: ExportType;

  private _innovation: Innovation;

  private _needConsent = true;

  private _showExportModal: boolean = false;

  public exportTypeEnum = ExportType;

  constructor(private _answerService: AnswerService,
              private _authService: AuthService,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService) {}


  public assignExportType(event: Event, type: ExportType) {
    event.preventDefault();
    this._exportType = type;
  }

  public toggleConsent(event: Event) {
    event.preventDefault();
    this._innovation.ownerConsent.value = !!event.target['checked'];
  }


  public exportInnovation(event: Event) {
    event.preventDefault();

    this.showExportModal = false;

    if (this._needConsent) {
      this._innovationService.saveConsent(this._innovation._id, Date.now()).subscribe(() => {
        this._print();
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
      });
    } else {
      this._print();
    }

  }


  private _print() {
    switch (this._exportType) {

      case (ExportType.csv):
        window.open(this._answerService.getExportUrl(this._innovation._id, true));
        break;

      case (ExportType.executiveReport):
        window.print();
        break;

      case (ExportType.respReport):
        window.open(`${environment.apiUrl}/reporting/job/answers/${this._innovation._id}?lang=${this.userLang}&print=1`);
        break;

      case (ExportType.shareReport):
        this._shareReportLink();
        break;

    }
  }


  private _shareReportLink() {
    this._innovationService.shareSynthesis(this._innovation._id).subscribe((response: Share) => {
      const url = `${environment.clientUrl}/share/synthesis/${response.objectId}/${response.shareKey}`;
      window.open(ShareService.reportShareMail(this._innovation, this.userLang, url), '_blank');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }

  get exportType(): ExportType {
    return this._exportType;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get showExportModal(): boolean {
    return this._showExportModal;
  }

  set showExportModal(value: boolean) {
    this.showModalChange.emit(value);
  }

  get userLang(): string {
    return this._translateService.currentLang
  }

}
