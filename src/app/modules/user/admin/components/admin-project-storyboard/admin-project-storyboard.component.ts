import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SpinnerService } from '../../../../../services/spinner/spinner';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { ErrorFrontService} from '../../../../../services/error/error-front';
import { TranslateService } from '@ngx-translate/core';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { ExecutiveReport, ExecutiveSection } from '../../../../../models/executive-report';
import { Innovation } from '../../../../../models/innovation';
import { CommonService } from '../../../../../services/common/common.service';
import { ExecutiveReportService } from '../../../../../services/executive-report/executive-report.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Question } from '../../../../../models/question';
import { ResponseService } from '../../../../shared/components/shared-market-report/services/response.service';
import { AnswerService } from '../../../../../services/answer/answer.service';
import { Answer } from '../../../../../models/answer';
import { MultilingPipe } from '../../../../../pipe/pipes/multiling.pipe';
import { BarData } from '../../../../shared/components/shared-market-report/models/bar-data';
import { PieChart } from '../../../../../models/pie-chart';
import { ExecutiveReportFrontService } from '../../../../../services/executive-report/executive-report-front.service';
import { Tag } from '../../../../../models/tag';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import FileSaver from 'file-saver';
import { DeliverableService } from '../../../../../services/deliverable/deliverable.service';
import { Job, JobType } from '../../../../../models/job';

@Component({
  selector: 'app-admin-storyboard',
  templateUrl: './admin-project-storyboard.component.html',
  styleUrls: ['./admin-project-storyboard.component.scss']
})

export class AdminProjectStoryboardComponent implements OnInit {

  private _executiveReport: ExecutiveReport = <ExecutiveReport>{};

  private _isLoading = true;

  private _isModalLang = false;

  private _modalTitle = '';

  private _selectedLang = '';

  private _toBeSaved = false;

  private _innovation: Innovation = <Innovation>{};

  private _reportType = '';

  private _questions: Array<Question> = [];

  private _isGeneratingReport = false;

  private _isModalVideo = false;

  private _videoJob: Job = <Job>{};

  private _selectedVideoType = 'VIDEO_TEST';

  private _isGeneratingVideo = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _spinnerService: SpinnerService,
              private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _executiveReportService: ExecutiveReportService,
              private _innovationFrontService: InnovationFrontService,
              private _commonService: CommonService,
              private _answerService: AnswerService,
              private _executiveReportFrontService: ExecutiveReportFrontService,
              private _multilingPipe: MultilingPipe,
              private _innovationService: InnovationService,
              private _responseService: ResponseService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService,
              private _deliverableService: DeliverableService) {

    this._setSpinner(true);

  }

  ngOnInit() {

    this._innovation = this._activatedRoute.snapshot.data['innovation'];
    this._setTitle(InnovationFrontService.currentLangInnovationCard(this._innovation, this.currentLang, 'title'));
    this._innovationFrontService.setInnovation(this._innovation);
    this._questions = ResponseService.presets(this._innovation);

    if (typeof this._innovation === 'undefined' || (this._innovation && !this._innovation._id)) {
      this._setSpinner(false);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage());
    } else if (this._innovation && this._innovation.executiveReportId) {
      this._getExecutiveReport();
    } else if (this._innovation && !this._innovation.executiveReportId) {
      this._setSpinner(false);
      this._isLoading = false;
    }

    this._getVideoJob();

  }

  private _getExecutiveReport() {
    if (isPlatformBrowser(this._platformId) && this._innovation && this._innovation.executiveReportId) {
      this._executiveReportService.get(this._innovation.executiveReportId).pipe(first()).subscribe((response) => {
        this._executiveReport = response;
        this._setSpinner(false);
        this._isLoading = false;
      }, (err: HttpErrorResponse) => {
        this._setSpinner(false);
        console.log(err);
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      });
    }
  }

  private _getVideoJob() {
    if (isPlatformBrowser(this._platformId) && this._innovation._id) {
      this._innovationService.getDeliverableJob(this._innovation._id).pipe(first()).subscribe((jobs) => {
        if (jobs && jobs.length) {
          const index = jobs.findIndex((job) => job.status === 'RECEIVED' || job.status === 'PROCESSING' || job.status === 'QUEUED');
          if (index !== -1) {
            this._videoJob = jobs[index];
          }
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
  }

  private _setSpinner(value: boolean) {
    this._spinnerService.state(value);
  }

  private _setTitle(title?: string) {
    this._translateTitleService.setTitle(title ? title + ' | Storyboard' : 'Storyboard');
  }

  public setNewSelectedLang(value: string) {
    this._selectedLang = value;
  }

  public autofillExecutiveReport(event: Event) {
    event.preventDefault();
    this._setSpinner(true);

    if (this._questions && this._questions.length > 0) {
      this._getAnswers();
    } else {
      this._setSpinner(false);
      this._translateNotificationsService.error('ERROR.ERROR', 'ADMIN_STORYBOARD.NO_QUESTIONS_MSG');
    }

  }

  private _getAnswers() {
    this._answerService.getInnovationValidAnswers(this._innovation._id).pipe(first()).subscribe((response) => {
      const answers: Array<Answer> = response.answers.sort((a, b) => {
        return b.profileQuality - a.profileQuality;
      });
      this._setReportSections(answers);
    }, (err: HttpErrorResponse) => {
      this._setSpinner(false);
      console.log(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });
  }

  private _setReportSections(answers: Array<Answer>) {

    const sections: Array<ExecutiveSection> = [];

    this._questions.forEach((question, index) => {
      if (this._executiveReport.sections && this._executiveReport.sections[index]) {

        sections[index] = {
          questionId: '',
          questionType: '',
          title: '',
          abstract: '',
          content: <any>{}
        };

        if (this._executiveReport.sections[index].questionId) {
          sections[index] = this._executiveReport.sections[index];
        } else {
          sections[index].questionId = question._id;
          sections[index].title = this._multilingPipe.transform(question.title, this._executiveReport.lang);
          const answersToShow: Array<Answer> = this._responseService.answersToShow(answers, question);
          const barsData: Array<BarData> = ResponseService.barsData(question, answersToShow);

          switch (question.controlType) {

            case 'radio':
              const pieChartData: PieChart = ResponseService.pieChartData(barsData, answersToShow);
              sections[index].questionType = 'PIE';
              sections[index].content = ExecutiveReportFrontService.pieChartSection(pieChartData, this._executiveReport.lang);
              break;

            case 'checkbox':
              sections[index].questionType = 'BAR';
              sections[index].content = this._executiveReportFrontService.barSection(barsData, this._executiveReport.lang);
              break;

            default:
              const tagsData: Array<Tag> = ResponseService.tagsList(answersToShow, question);
              sections[index].questionType = 'RANKING';
              sections[index].content = this._executiveReportFrontService.rankingSection(tagsData, this._executiveReport.lang);
              break;

          }
        }

      }
    });

    this._executiveReport.sections = sections;
    this._setSpinner(false);
    this._toBeSaved = true;

  }

  public onChangeDiffusion(event: Event) {
    event.preventDefault();
    this._executiveReport.externalDiffusion = (event.target as HTMLInputElement).checked;
    this._toBeSaved = true;
  }

  public openLangModal(event: Event, type: string) {
    event.preventDefault();
    this._reportType = type;
    this._modalTitle = this._executiveReport.lang ? 'ADMIN_STORYBOARD.MODAL.CHANGE_TITLE' : 'ADMIN_STORYBOARD.MODAL.SELECT_TITLE';
    this._isModalLang = true;
  }

  public onClickConfirm(event: Event) {
    event.preventDefault();
    this._setSpinner(true);
    this._isModalLang = false;
    this._isLoading = true;

    switch (this._reportType) {

      case 'CREATE':
        this._createExecutiveReport();
        break;

      case 'RESET':
        this._resetExecutiveReport();
        break;

    }

    this._reportType = '';

  }

  private _createExecutiveReport() {
    this._executiveReportService.create(this._selectedLang, this._innovation._id).pipe(first()).subscribe((response) => {
      this._executiveReport = response;
      this._setSpinner(false);
      this._isLoading = false;
    }, (err: HttpErrorResponse) => {
      this._setSpinner(false);
      console.log(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });
  }

  private _resetExecutiveReport() {
    this._executiveReportService.delete(this._executiveReport._id).pipe(first()).subscribe((response) => {
      this._createExecutiveReport();
    }, (err: HttpErrorResponse) => {
      this._setSpinner(false);
      console.log(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });
  }

  public copyLink(event: Event, linkToCopy: string) {
    event.preventDefault();
    this._commonService.copyToClipboard(linkToCopy);
    this._translateNotificationsService.success('ERROR.SUCCESS', 'ADMIN_STORYBOARD.TOAST.URL_COPIED');
  }

  /***
   * when the user clicks on the Generate Video button
   * @param event
   */
  public openVideoModal(event: Event) {
    event.preventDefault();
    this._selectedVideoType = 'VIDEO_TEST';
    this._isModalVideo = true;
  }

  /***
   * when the user clicks on the Cancel button in the Video modal.
   */
  public closeModal() {
   this._isModalVideo = false;
    this._selectedVideoType = 'VIDEO_TEST';
  }

  /***
   * when the user selects the Video type from the Video modal.
   * @param event
   * @param type
   */
  public setVideo(event: Event, type: JobType) {
    event.preventDefault();
    this._selectedVideoType = type;
  }

  /***
   * when the user clicks the Generate button of the Video modal.
   * @param event
   */
  public generateVideo(event: Event) {
    event.preventDefault();
    if (!this._isGeneratingVideo) {
      this._isGeneratingVideo = true;
      this._deliverableService.registerJob(this._innovation.owner.id, this._innovation._id, this._selectedVideoType)
        .subscribe((job) => {
          this._videoJob = job;
          this.closeModal();
          this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.JOB.VIDEO');
        }, (err: HttpErrorResponse) => {
          console.error(err);
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        });
    }
  }

  public generatePdf(event: Event) {
    event.preventDefault();
    if (!this._isGeneratingReport) {
      this._isGeneratingReport = true;
      const filename = this._innovation.name ? `UMI Executive report -
      ${this._innovation.name.slice(0, Math.min(13, this._innovation.name.length))}.pdf` : 'innovation_umi.pdf';
      this._innovationService.executiveReportPDF(this._innovation._id).pipe(first()).subscribe( data => {
        const blob = new Blob([data], {type: 'application/pdf'});
        FileSaver.saveAs(blob, filename);
        this._isGeneratingReport = false;
      }, (err: HttpErrorResponse) => {
        this._isGeneratingReport = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    }
  }

  public saveExecutiveReport(event: Event) {
    event.preventDefault();
    // Clean the client company to leave only the id
    const ex_report = <any>this._executiveReport;
    ex_report.client.company = this._executiveReport.client.company.id;
    // TODO is this a good solution?
    this._executiveReportService.save(this._executiveReport).pipe(first()).subscribe((response) => {
      this._toBeSaved = false;
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ADMIN_EXECUTIVE_REPORT.SAVE');
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });
  }

  get isVideoDisabled(): boolean {
    return this._executiveReport.completion !== 100 || this._videoJob.status && (this._videoJob.status === 'RECEIVED'
      || this._videoJob.status === 'QUEUED' || this._videoJob.status === 'PROCESSING')
      || !this._executiveReport.externalDiffusion;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get isModalLang(): boolean {
    return this._isModalLang;
  }

  set isModalLang(value: boolean) {
    this._isModalLang = value;
  }

  get executiveReport(): ExecutiveReport {
    return this._executiveReport;
  }

  set executiveReport(value: ExecutiveReport) {
    this._executiveReport = value;
    this._toBeSaved = true;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get selectedLang(): string {
    return this._selectedLang;
  }

  get modalTitle(): string {
    return this._modalTitle;
  }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get questions(): Array<Question> {
    return this._questions;
  }

  get isGeneratingReport(): boolean {
    return this._isGeneratingReport;
  }

  get isModalVideo(): boolean {
    return this._isModalVideo;
  }

  set isModalVideo(value: boolean) {
    this._isModalVideo = value;
  }

  get videoJob(): Job {
    return this._videoJob;
  }

  get isGeneratingVideo(): boolean {
    return this._isGeneratingVideo;
  }

}
