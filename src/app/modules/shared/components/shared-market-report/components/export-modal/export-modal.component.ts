import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';

export enum ExportType { csv = 'csv', executiveReport = 'executiveReport', respReport = 'respReport' }

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
    this._innovation = value;
  }

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _exportType: ExportType;

  private _innovation: Innovation;

  private _showExportModal: boolean = false;

  public exportTypeEnum = ExportType;

  constructor(private _answerService: AnswerService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService) { }


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

    this._innovation.ownerConsent.date = Date.now();

    this._innovationService.save(this._innovation._id, this._innovation).subscribe(() => {
      this._print();
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });

  }


  private _print() {
    switch (this._exportType) {

      case(ExportType.csv):
        window.open(this._answerService.getExportUrl(this._innovation._id, true));
        break;

      case(ExportType.executiveReport):
        window.print();
        break;

      case(ExportType.respReport):
        this._printRespReport();
        break;

    }
  }


  private _printRespReport() {
    this._answerService.getReportHTML(this._innovation._id, 'en').subscribe(html => {
      const reportWindow = window.open('', '');
      reportWindow.document.write(html);
      setTimeout(() => {
        reportWindow.focus();
        reportWindow.print();
        reportWindow.close();
      }, 500);
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

}
