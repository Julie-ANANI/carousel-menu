import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {Innovation} from '../../../../../../../models/innovation';
import {InnovationFrontService} from '../../../../../../../services/innovation/innovation-front.service';
import {first, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from '../../../../../../../services/auth/auth.service';
import {User} from '../../../../../../../models/user.model';
import {InnovationService} from '../../../../../../../services/innovation/innovation.service';
import {TranslateNotificationsService} from '../../../../../../../services/translate-notifications/translate-notifications.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../../services/error/error-front.service';
import {CommonService} from '../../../../../../../services/common/common.service';
import {environment} from '../../../../../../../../environments/environment';
import {AnswerService} from '../../../../../../../services/answer/answer.service';
import {TranslateService} from '@ngx-translate/core';
import FileSaver from 'file-saver';
import {isPlatformBrowser} from '@angular/common';
import {ExecutiveReportService} from '../../../../../../../services/executive-report/executive-report.service';
import {ContactFrontService} from '../../../../../../../services/contact/contact-front.service';
import {ClientProject} from '../../../../../../../models/client-project';
import {ShareService} from '../../../../../../../services/share/share.service';

interface Document {
  name: string;
  isExportable: boolean;
  img: string;
}

@Component({
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})

export class DocumentsComponent implements OnInit, OnDestroy {

  get ownerConsent(): boolean {
    return this._ownerConsent;
  }

  private _innovation: Innovation = <Innovation>{};

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _documents: Array<Document> = [
    {
      name: 'REPORT',
      isExportable: false,
      img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/executive-report.png' },
    {
      name: 'SHARE',
      isExportable: false,
      img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/share-link.png'
    },
    {
      name: 'XLSX',
      isExportable: false,
      img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/csv-answers.png'
    },
    {
      name: 'PDF',
      isExportable: false,
      img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/pdf-answer.png'
    },
    {
      name: 'VIDEO',
      isExportable: false,
      img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/video-synthesis.png'
    }
  ];

  private _isLinkCopied = false;

  private _isGeneratingLink = false;

  private _isGeneratingXLSX = false;

  private _isGeneratingPDF = false;

  private _isGeneratingReport = false;

  private _timeout: ReturnType<typeof setTimeout>;

  private _anonymousXLSX = true;

  private _ownerConsent = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _innovationFrontService: InnovationFrontService,
              private _authService: AuthService,
              private _shareService: ShareService,
              private _commonService: CommonService,
              private _answerService: AnswerService,
              private _executiveReportService: ExecutiveReportService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService) { }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation || <Innovation>{};
      this._initDocuments();
      this._anonymousXLSX = !!(this._innovation._metadata && this._innovation._metadata.campaign
        && this._innovation._metadata.campaign.anonymous_answers);
      this._ownerConsent = this._innovation.ownerConsent && this._innovation.ownerConsent.value;
    });
  }

  private _initDocuments() {
    if (!!this._innovation._id) {
      this._documents.forEach((document) => {
        switch (document.name) {

          case 'REPORT':
            if (this._innovation.executiveReportId) {
              this._getExecutiveReport();
            } else if (this._innovation.executiveReport && this._innovation.executiveReport.sections
              && this._innovation.executiveReport.sections.length) {
              document.isExportable = true;
            }
            break;

          case 'VIDEO':
            document.isExportable = true;
            break;

          case 'SHARE':
            document.isExportable = this._innovation.previewMode || (this._innovation.status && this._innovation.status === 'DONE');
            break;

          case 'XLSX':
          case 'PDF':
            document.isExportable = this._innovation.previewMode || (this._innovation.status
              && this._innovation.status === 'EVALUATING');
            break;

        }
      });
    }
  }

  /***
   * getting the ER from the back and checking the externalDiffusion value if true then downloadable
   * else not.
   * @private
   */
  private _getExecutiveReport() {
    if (isPlatformBrowser(this._platformId) && this._innovation.executiveReportId) {
      this._executiveReportService.get(this._innovation.executiveReportId).pipe(first()).subscribe((response) => {
        const index = this._documents.findIndex((_document) => _document.name === 'REPORT');
        if (index !== -1) {
          this._documents[index].isExportable = response.externalDiffusion;
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
  }

  /***
   * when the user checks the consent box.
   * @param event
   */
  public toggleConsent(event: Event) {
    event.preventDefault();
    if (this.isOwner) {
      this._innovation.ownerConsent.value = !!(event.target as HTMLInputElement).checked;
      this._innovation.ownerConsent.date = new Date();
      this._innovationService.save(this._innovation._id, this._innovation).pipe(first()).subscribe(() => {
      }, (err: HttpErrorResponse) => {
        this._innovation.ownerConsent.value = !this._innovation.ownerConsent.value;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    }
  }

  /***
   * when the user clicks on the Share button, get the share link from the back
   * and copy it to the clipboard.
   */
  public onClickShare(event: Event) {
    event.preventDefault();
    if (!this._isLinkCopied && this.isOwner && this._ownerConsent) {
      this._isGeneratingLink = true;
      this._innovationService.shareSynthesis(this._innovation._id).pipe(first()).subscribe((share) => {
        this._commonService.copyToClipboard(this._shareService.generateShareSynthesisUrl(share));
        this._isGeneratingLink = false;
        this._isLinkCopied = true;
        this._timeout = setTimeout(() => {
          this._isLinkCopied = false;
        }, 8000);
      }, (err: HttpErrorResponse) => {
        this._isGeneratingLink = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    }
  }

  /***
   * when the user clicks on the Download CSV button.
   */
  public onClickXLSX(event: Event) {
    event.preventDefault();
    if (!this._isGeneratingXLSX && this.isOwner && this._ownerConsent) {
      this._isGeneratingXLSX = true;
      const url = this._innovationService.getExportUrl(this._innovation._id, true, this.userLang, this._anonymousXLSX);
      this._timeout = setTimeout(() => {
        window.open(url);
        this._isGeneratingXLSX = false;
      }, 1000);
    }
  }

  /***
   * when the user clicks on the Download PDF button.
   */
  public onClickPDF(event: Event) {
    event.preventDefault();
    if (!this._isGeneratingPDF && this.isOwner && this._ownerConsent) {
      this._isGeneratingPDF = true;
      const url = this._answerService.exportAsPDF(this._innovation._id, this.userLang);
      this._timeout = setTimeout(() => {
        window.open(url);
        this._isGeneratingPDF = false;
      }, 1000);
    }
  }

  /***
   * when the user clicks on the Download Report button.
   */
  public onClickReport(event: Event) {
    event.preventDefault();
    if (!this._isGeneratingReport && this.isOwner && this._ownerConsent) {
      this._isGeneratingReport = true;
      const filename = this._innovation.name ? `UMI Executive report -
      ${this._innovation.name.slice(0, Math.min(13, this._innovation.name.length))}.pdf` : 'innovation_umi.pdf';
      this._innovationService.executiveReportPDF(this._innovation._id).pipe(first()).subscribe( data => {
        const blob = new Blob([data], {type: 'application/pdf'});
        FileSaver.saveAs(blob, filename);
        this._isGeneratingReport = false;
      }, (err: HttpErrorResponse) => {
        this._isGeneratingReport = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    }
  }

  /***
   * when the user clicks on the Contact Commercial button
   * @param event
   */
  public onClickContact(event: Event) {
    event.preventDefault();
    if (this.isOwner && this._ownerConsent) {
      const clientProject = <ClientProject>this._innovation.clientProject;
      const email = clientProject && clientProject.commercial && clientProject.commercial.email || environment.commercialContact;
      window.open(ContactFrontService.commercialVideo(this._innovation, email, this.userLang), '_blank');
    }
  }

  /**
   * This should return true also for the collaborators
   */
  get isOwner(): boolean {
    return this._authService.isAdmin ||
      (this._innovation.owner && (this.user.id === this._innovation.owner.id ||
        this._innovation.collaborators.findIndex(col => col.id === this.user.id) > -1));
  }

  get user(): User {
    return this._authService.user ? this._authService.user : <User>{};
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get documents(): Array<Document> {
    return this._documents;
  }

  get isLinkCopied(): boolean {
    return this._isLinkCopied;
  }

  get isGeneratingLink(): boolean {
    return this._isGeneratingLink;
  }

  get isGeneratingXLSX(): boolean {
    return this._isGeneratingXLSX;
  }

  get isGeneratingPDF(): boolean {
    return this._isGeneratingPDF;
  }

  get isGeneratingReport(): boolean {
    return this._isGeneratingReport;
  }

  get userLang(): string {
    return this._translateService.currentLang;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
    clearTimeout(this._timeout);
  }

}
