import {Component, OnDestroy, OnInit} from '@angular/core';
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

  documents: Array<Document> = [
    { name: 'REPORT', isExportable: false, img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/executive-report.png' },
    { name: 'SHARE', isExportable: false, img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/share-link.png' },
    { name: 'CSV', isExportable: false, img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/csv-answers.png' },
    { name: 'PDF', isExportable: false, img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/pdf-answers.png' },
    { name: 'VIDEO', isExportable: false, img: 'https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/video-synthesis.png' }
  ];

  isLinkCopied = false;

  isGeneratingLink = false;

  constructor(private _innovationFrontService: InnovationFrontService,
              private _authService: AuthService,
              private _commonService: CommonService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService) { }

  ngOnInit() {

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
      this._initDocuments();
    });

  }

  /***
   *
   * @private
   */
  private _initDocuments() {
    this.documents.forEach((document) => {
      switch (document.name) {

        case 'REPORT':
          break;

        case 'VIDEO':
          break;

        case 'SHARE':
        case 'CSV':
        case 'PDF':
          document.isExportable = this.isOwner && this.ownerConsent && this._innovation.previewMode
            || (this._innovation.status && this._innovation.status === 'DONE');
          break;

      }
    });
  }

  /***
   * when the user checks the consent box.
   * @param event
   */
  public toggleConsent(event: Event) {
    event.preventDefault();
    this._innovation.ownerConsent.value = !!(event.target as HTMLInputElement).checked;
    this._innovationService.saveConsent(this._innovation._id, Date.now()).pipe(first()).subscribe(() => {
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.log(err);
    });
  }

  /***
   * when the user clicks on the Share button, get the share link from the back
   * and copy it to the clipboard.
   */
  public onClickShare(event: Event) {
    event.preventDefault();
    if (!this.isLinkCopied) {
      this.isGeneratingLink = true;
      this._innovationService.shareSynthesis(this._innovation._id).pipe(first()).subscribe((share) => {
        const url = `${environment.clientUrl}/share/synthesis/${share.objectId}/${share.shareKey}`;
        this._commonService.copyToClipboard(url);
        this.isGeneratingLink = false;
        this.isLinkCopied = true;

        setTimeout(() => {
          this.isLinkCopied = false;
        }, 8000);

      }, (err: HttpErrorResponse) => {
        this.isGeneratingLink = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.log(err);
      });
    }
  }

  get ownerConsent(): boolean {
    return this._innovation.ownerConsent && this._innovation.ownerConsent.value;
  }

  get isOwner(): boolean {
    return this.user.id === (this._innovation.owner && this._innovation.owner.id);
  }

  get user(): User {
    return this._authService.user ? this._authService.user : <User>{};
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
