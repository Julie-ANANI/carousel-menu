import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {Innovation} from '../../../../../../../models/innovation';
import {InnovationFrontService} from '../../../../../../../services/innovation/innovation-front.service';
import {first, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from '../../../../../../../services/auth/auth.service';
import {User} from '../../../../../../../models/user.model';
import {InnovationService} from '../../../../../../../services/innovation/innovation.service';
import {TranslateNotificationsService} from '../../../../../../../services/notifications/notifications.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../../services/error/error-front';
import {CommonService} from '../../../../../../../services/common/common.service';
import {environment} from '../../../../../../../../environments/environment';
import {AnswerService} from '../../../../../../../services/answer/answer.service';
import {TranslateService} from '@ngx-translate/core';
import FileSaver from "file-saver";
import {isPlatformBrowser} from '@angular/common';
import {ExecutiveReportService} from '../../../../../../../services/executive-report/executive-report.service';
import {ContactFrontService} from '../../../../../../../services/contact/contact-front.service';
import {ClientProject} from '../../../../../../../models/client-project';

interface Document {
  name: string;
  isExportable: boolean;
  img: string;
}

@Component({
  selector: 'documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})

export class DocumentsComponent implements OnInit, OnDestroy {

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
      name: 'CSV',
      isExportable: false,
      img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/csv-answers.png'
    },
    {
      name: 'PDF',
      isExportable: false,
      img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/pdf-answers.png'
    },
    {
      name: 'VIDEO',
      isExportable: false,
      img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/video-synthesis.png'
    }
  ];

  private _userLang = this._translateService.currentLang || 'en';

  private _isLinkCopied = false;

  private _isGeneratingLink = false;

  private _isGeneratingCSV = false;

  private _isGeneratingPDF = false;

  private _isGeneratingReport = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _innovationFrontService: InnovationFrontService,
              private _authService: AuthService,
              private _commonService: CommonService,
              private _answerService: AnswerService,
              private _executiveReportService: ExecutiveReportService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService) { }

  ngOnInit() {

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
      this._initDocuments();
    });

  }

  private _initDocuments() {
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

        case 'CSV':
        case 'PDF':
          document.isExportable = this._innovation.previewMode || (this._innovation.status && this._innovation.status === 'EVALUATING');
          break;

      }
    });
  }

  /***
   * getting the ER from the back and checking the externalDiffusion value if true then downloadable
   * else not.
   * @private
   */
  private _getExecutiveReport() {
    if (isPlatformBrowser(this._platformId) && this._innovation.executiveReportId) {
      this._executiveReportService.get(this._innovation.executiveReportId).pipe(first()).subscribe((response) => {
        const index = this._documents.findIndex((document) => document.name === 'REPORT');
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
      this._innovationService.saveConsent(this._innovation._id, Date.now()).pipe(first()).subscribe(() => {
      }, (err: HttpErrorResponse) => {
        this._innovation.ownerConsent.value = !this._innovation.ownerConsent.value;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
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
    if (!this._isLinkCopied && this.isOwner && this.ownerConsent) {
      this._isGeneratingLink = true;
      this._innovationService.shareSynthesis(this._innovation._id).pipe(first()).subscribe((share) => {
        const url = `${environment.clientUrl}/share/synthesis/${share.objectId}/${share.shareKey}`;
        this._commonService.copyToClipboard(url);
        this._isGeneratingLink = false;
        this._isLinkCopied = true;

        setTimeout(() => {
          this._isLinkCopied = false;
        }, 8000);

      }, (err: HttpErrorResponse) => {
        this._isGeneratingLink = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    }
  }

  /***
   * when the user clicks on the Download CSV button.
   */
  public onClickCSV(event: Event) {
    event.preventDefault();
    if (!this._isGeneratingCSV && this.isOwner && this.ownerConsent) {
      this._isGeneratingCSV = true;
      const url = this._answerService.getExportUrl(this._innovation._id, true, this.anonymousCSV);
      setTimeout(() => {
        window.open(url);
        this._isGeneratingCSV = false;
      }, 1000);
    }
  }

  /***
   * when the user clicks on the Download PDF button.
   */
  public onClickPDF(event: Event) {
    event.preventDefault();
    if (!this._isGeneratingPDF && this.isOwner && this.ownerConsent) {
      this._isGeneratingPDF = true;
      const url = this._answerService.exportAsPDF(this._innovation._id, this._userLang);
      setTimeout(() => {
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
    if (!this._isGeneratingReport && this.isOwner && this.ownerConsent) {
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

  /***
   * when the user clicks on the Contact Commercial button
   * @param event
   */
  public onClickContact(event: Event) {
    event.preventDefault();
    if (this.isOwner && this.ownerConsent) {
      const clientProject = <ClientProject>this._innovation.clientProject;
      const email = clientProject && clientProject.commercial && clientProject.commercial.email || 'achampagne@umi.us';
      window.open(ContactFrontService.commercialVideo(this._innovation, email, this._userLang), '_blank');
    }
  }

  get anonymousCSV(): boolean {
    return !!(this._innovation._metadata && this._innovation._metadata.campaign && this._innovation._metadata.campaign.anonymous_answers);
  }

  get ownerConsent(): boolean {
    return this._innovation.ownerConsent && this._innovation.ownerConsent.value;
  }

  get isOwner(): boolean {
    return (this.user.id === (this._innovation.owner && this._innovation.owner.id)) || this._authService.isAdmin;
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

  get userLang(): string {
    return this._userLang;
  }

  get isLinkCopied(): boolean {
    return this._isLinkCopied;
  }

  get isGeneratingLink(): boolean {
    return this._isGeneratingLink;
  }

  get isGeneratingCSV(): boolean {
    return this._isGeneratingCSV;
  }

  get isGeneratingPDF(): boolean {
    return this._isGeneratingPDF;
  }

  get isGeneratingReport(): boolean {
    return this._isGeneratingReport;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
