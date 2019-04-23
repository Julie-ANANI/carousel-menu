import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { FilterService } from '../../services/filters.service';
import { InnovationCommonService } from '../../../../../../services/innovation/innovation-common.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';

export enum ExportType { csv = 'csv', executiveReport = 'executiveReport', respReport = 'respReport' }

@Component({
  selector: 'app-market-report-export-modal',
  templateUrl: 'export-modal.component.html',
  styleUrls: ['export-modal.component.scss']
})

export class ExportModalComponent {

  public exportTypeEnum = ExportType;

  @Input() set showModal(value: boolean) {
    this._showExportModal = value;
    if (value) {
      this._filters = Object.keys(this.filterService.filters).length > 0;
      this.useFilters = this._filters;
    }
  }

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() set innovation(value: Innovation) {
    this._innovation = value;
  }

  private _exportType: ExportType;

  private _innovation: Innovation;

  private _showExportModal: boolean;

  private _filters: boolean;

  public useFilters: boolean;

  constructor(private answerService: AnswerService,
              private filterService: FilterService,
              private innovationCommonService: InnovationCommonService,
              private translateNotificationsService: TranslateNotificationsService) { }

  public assignExportType(event: Event, type: ExportType) {
    event.preventDefault();
    this._exportType = type;
  }

  public exportInnovation(event: Event) {
    event.preventDefault();
    this.showExportModal = false;
    this._innovation.ownerConsent.date = Date.now();
    this.innovationCommonService.saveInnovation(this._innovation);
    switch (this._exportType) {
      case(ExportType.csv):
        window.open(this.answerService.getExportUrl(this._innovation._id, true));
        break;
      case(ExportType.executiveReport):
        window.print();
        break;
      case(ExportType.respReport):
        this.printAnswers();
        break;
    }
  }

  private printAnswers() {
    this.answerService.getReportHTML(this._innovation._id, 'en').subscribe(html => {
      const reportWindow = window.open('', '');
      reportWindow.document.write(html);
      setTimeout(() => {
        reportWindow.focus();
        reportWindow.print();
        reportWindow.close();
      }, 500);
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }

  public toggleConsent(event: Event) {
    event.preventDefault();
    this._innovation.ownerConsent.value = !!event.target['checked'];
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

  get filters(): boolean {
    return this._filters;
  }

}
