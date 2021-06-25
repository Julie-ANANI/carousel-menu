import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ExecutiveReport, ExecutiveSection } from '../../../../../../models/executive-report';
import { Innovation } from '../../../../../../models/innovation';
import { CommonService } from '../../../../../../services/common/common.service';
import { ExecutiveReportService } from '../../../../../../services/executive-report/executive-report.service';
import {first, takeUntil} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Question } from '../../../../../../models/question';
import { ResponseService } from '../../../../../shared/components/shared-market-report/services/response.service';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { Answer } from '../../../../../../models/answer';
import { BarData } from '../../../../../shared/components/shared-market-report/models/bar-data';
import { PieChart } from '../../../../../../models/pie-chart';
import { ExecutiveReportFrontService } from '../../../../../../services/executive-report/executive-report-front.service';
import { Tag } from '../../../../../../models/tag';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import FileSaver from 'file-saver';
import { DeliverableService } from '../../../../../../services/deliverable/deliverable.service';
import { Job, JobType } from '../../../../../../models/job';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../../../../../../services/socket/socket.service';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../../../services/auth/auth.service';
import {MissionQuestion} from '../../../../../../models/mission';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {MissionQuestionService} from '../../../../../../services/mission/mission-question.service';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';

@Component({
  templateUrl: './admin-project-storyboard.component.html',
  styleUrls: ['./admin-project-storyboard.component.scss']
})

export class AdminProjectStoryboardComponent implements OnInit, OnDestroy {

  private _executiveReport: ExecutiveReport = <ExecutiveReport>{};

  private _isLoading = true;

  private _isModalLang = false;

  private _modalTitle = '';

  private _selectedLang = '';

  private _toBeSaved = false;

  private _innovation: Innovation = <Innovation>{};

  private _reportType = '';

  private _questions: Array<Question | MissionQuestion> = [];

  private _isGeneratingReport = false;

  private _isModalVideo = false;

  private _selectedVideoType = 'VIDEO_TEST';

  private _isGeneratingVideo = false;

  private _showBanner = false;

  private _bannerVideo: Job = <Job>{};

  private _videoJobs: Array<Job> = [];

  private _fetchingError = false;

  private _isChargingReport = true;

  private _showBannerUpdate = '';

  private _updateTime: number;

  private _updatedReportObj: { [P in keyof ExecutiveReport]?: ExecutiveReport[P]; } = {};

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _executiveReportService: ExecutiveReportService,
              private _commonService: CommonService,
              private _answerService: AnswerService,
              private _rolesFrontService: RolesFrontService,
              private _executiveReportFrontService: ExecutiveReportFrontService,
              private _innovationService: InnovationService,
              private _responseService: ResponseService,
              private _socketService: SocketService,
              private _authService: AuthService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _deliverableService: DeliverableService) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {

      this._innovation = this._activatedRoute.snapshot.parent.parent.data['innovation'];
      this._questions = InnovationFrontService.questionsList(this._innovation);

      if (typeof this._innovation === 'undefined' || (this._innovation && !this._innovation._id)) {
        this._isChargingReport = false;
        this._isLoading = false;
        this._fetchingError = true;
      } else if (this._innovation && this._innovation.executiveReportId) {
        this._getExecutiveReport();
      } else if (this._innovation && !this._innovation.executiveReportId) {
        this._isChargingReport = false;
        this._isLoading = false;
      }

      this._getVideoJob();

      this._socketService.getNewReport(this._innovation._id).pipe(takeUntil(this._ngUnsubscribe)).subscribe((update: any) => {
          if (update.userId !== this._authService.userId) {
            this._showBanner = update.userName;
            this._updateTime = Date.now();
          }
          this._executiveReport = update.data;
          this._realtimeUpdate(this._executiveReport._id);
        }, (error) => {
          console.error(error);
        });

    }
  }

  private _realtimeUpdate(executiveReportId: string) {
    this._socketService.getReportUpdates(executiveReportId)
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((update: any) => {
        const executiveReport = JSON.parse(JSON.stringify(this._executiveReport));
        if (update.userId !== this._authService.userId) {
          this._showBanner = update.userName;
          this._updateTime = Date.now();
        }

        Object.keys(update.data).forEach(key => {
          if (key.slice(0, 8) === 'section_') {
            const index = parseInt(key[8], 10);
            executiveReport.sections[index] = update.data[key];
          } else {
            executiveReport[key] = update.data[key];
          }
        });
        this._executiveReport = executiveReport;
      }, (error) => {
        console.error(error);
      });
  }

  private _getExecutiveReport() {
    this._executiveReportService.get(this._innovation.executiveReportId).pipe(first()).subscribe((response) => {
      this._executiveReport = response;
      this._isLoading = false;
      this._isChargingReport = false;
    }, (err: HttpErrorResponse) => {
      this._isChargingReport = false;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(err));
      console.error(err);
    });
    this._realtimeUpdate(this._innovation.executiveReportId);
  }

  private _getVideoJob() {
    if (this._innovation && this._innovation._id) {
      this._innovationService.getDeliverableJob(this._innovation._id).pipe(first()).subscribe((jobs) => {
        this._videoJobs = jobs;
        const _jobs: Array<Job> = this._jobs();
        if (_jobs.length === 1) {
          this._bannerVideo = _jobs[0];
          this._showBanner = true;
        } else if (_jobs.length > 1) {
          const _index = _jobs.findIndex((video) => video.jobType ===  'VIDEO_FINAL');
          if (_index !== -1) {
            this._bannerVideo = _jobs[_index];
            this._showBanner = true;
          }
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
  }

  private _jobs(): Array<Job> {
    return this._videoJobs.filter((video) => video.jobType === 'VIDEO_TEST' || video.jobType === 'VIDEO_FINAL');
  }

  public setNewSelectedLang(value: string) {
    this._selectedLang = value;
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'storyboard'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'storyboard']);
    }
  }

  public autofillExecutiveReport(event: Event) {
    event.preventDefault();
    this._isChargingReport = true;

    if (this._questions && this._questions.length > 0) {
      this._getAnswers();
    } else {
      this._isChargingReport = false;
      this._translateNotificationsService.error('ERROR.ERROR', 'ADMIN_STORYBOARD.NO_QUESTIONS_MSG');
    }

  }

  private _getAnswers() {
    this._answerService.getInnovationValidAnswers(this._innovation._id)
      .pipe(first())
      .subscribe((response) => {
        const answers: Array<Answer> = response.answers.sort((a, b) => {
          return b.profileQuality - a.profileQuality;
        });
        this._setReportSections(answers);
      }, (err: HttpErrorResponse) => {
        this._isChargingReport = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(err));
        console.error(err);
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
          sections[index].title = MissionQuestionService.label(question, 'title', this._executiveReport.lang);
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
    this._updatedReportObj.sections = sections;
    this._isChargingReport = false;
    this._toBeSaved = true;

  }

  public onChangeDiffusion(event: Event) {
    event.preventDefault();
    this._executiveReport.externalDiffusion = (event.target as HTMLInputElement).checked;
    this._toBeSaved = true;
    this._updatedReportObj.externalDiffusion = this._executiveReport.externalDiffusion;
  }

  public openLangModal(event: Event, type: string) {
    event.preventDefault();
    this._reportType = type;
    this._modalTitle = this._executiveReport.lang ? 'ADMIN_STORYBOARD.MODAL.CHANGE_TITLE'
      : 'ADMIN_STORYBOARD.MODAL.SELECT_TITLE';
    this._isModalLang = true;
  }

  public onClickConfirm(event: Event) {
    event.preventDefault();
    this._isChargingReport = true;
    this._isModalLang = false;

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
    this._executiveReportService.create(this._selectedLang, this._innovation._id)
      .pipe(first())
      .subscribe((response) => {
        this._executiveReport = response;
        this._isLoading = false;
        this._isChargingReport = false;
        this._realtimeUpdate(response._id);
      }, (err: HttpErrorResponse) => {
        this._isChargingReport = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(err));
        console.error(err);
      });
  }

  private _resetExecutiveReport() {
    this._executiveReportService.delete(this._executiveReport._id).pipe(first()).subscribe((response) => {
      this._createExecutiveReport();
    }, (err: HttpErrorResponse) => {
      this._isChargingReport = false;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(err));
      console.error(err);
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
          this._isGeneratingVideo = false;
          this.closeModal();
          this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.JOB.VIDEO');
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(err));
          this._isGeneratingVideo = false;
          console.error(err);
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
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(err));
        this._isGeneratingReport = false;
        console.error(err);
      });
    }
  }

  public saveExecutiveReport(event: Event) {
    event.preventDefault();
    if (this._toBeSaved) {
      // Clean the client company to leave only the id
      const ex_report = <any>this._executiveReport;
      if (this._executiveReport.client && this._executiveReport.client.company) {
        ex_report.client.company = this._executiveReport.client.company.id;
      }
      // TODO is this a good solution?
      this._executiveReportService.save(this._executiveReport._id, this._updatedReportObj).pipe(first()).subscribe((response) => {
        this._updatedReportObj = {};
        this._executiveReport = response;
        this._toBeSaved = false;
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ADMIN_EXECUTIVE_REPORT.SAVE');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(err));
        console.error(err);
      });
    }
  }

  public updateReport(value: any) {
    Object.keys(value).forEach(key => {
      if (key.slice(0, 8) === 'section_') {
        const index = parseInt(key[8], 10);
        this._executiveReport.sections[index] = value[key];
      } else {
        this._executiveReport[key] = value[key];
      }
      this._updatedReportObj[key] = value[key];
    });
    if (this.canAccess(['edit'])) {
      this._toBeSaved = true;
    }
  }

  get bannerBackground(): string {
    return this._bannerVideo.status === 'ERROR' ? 'bg-alert' : this._bannerVideo.status === 'DONE'
      ? 'bg-success' : 'bg-primary';
  }

  get isVideoDisabled(): boolean {
    return this._executiveReport.completion !== 100 || !this._executiveReport.externalDiffusion;
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

  get questions(): Array<Question | MissionQuestion> {
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

  get isGeneratingVideo(): boolean {
    return this._isGeneratingVideo;
  }

  get showBanner(): boolean {
    return this._showBanner;
  }

  set showBanner(value: boolean) {
    this._showBanner = value;
  }

  get bannerVideo(): Job {
    return this._bannerVideo;
  }

  get videoJobs(): Array<Job> {
    return this._videoJobs;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get isChargingReport(): boolean {
    return this._isChargingReport;
  }

  get showBannerUpdate(): string {
    return this._showBannerUpdate;
  }

  set showBannerUpdate(value: string) {
    this._showBannerUpdate = value;
  }

  get updateTime(): number {
    return this._updateTime;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
