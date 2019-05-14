import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user/user.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { environment } from '../../../../../../environments/environment';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { Share } from '../../../../../models/share';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-synthesis-list',
  templateUrl: './synthesis-list.component.html',
  styleUrls: ['./synthesis-list.component.scss']
})

export class SynthesisListComponent implements OnInit, OnDestroy {

  private _subscriptions = Array<any>();

  private _totalReports: Array<any>;

  private _config = {
    fields: 'name owner principalMedia',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _noResult = false;

  constructor( private _translateTitleService: TranslateTitleService,
               private _userService: UserService,
               private _innovationService: InnovationService,
               private _translateNotificationsService: TranslateNotificationsService,
               private _translateService: TranslateService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.SHARED_REPORTS');

  }

  ngOnInit() {
    this._totalReports = [];
    this._getUserReports();
  }

  private _getUserReports() {
    this._subscriptions.push(this._userService.getSharedWithMe(this._config).subscribe((reports: any) => {
      this._getSharedReports(reports.sharedgraph || []);
      this._noResult = reports.sharedgraph.length === 0;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    }));
  }


  /***
   * this function is getting the shared reports of the user and we are
   * pushing those to totalReports variable.
   */
  private _getSharedReports(receivedReports: any) {
    receivedReports.forEach((info: Share) => {
      this._subscriptions.push(this._innovationService.get(info.sharedObjectId, this.config).subscribe(result => {
        const report: Share = {
          name: result.name,
          owner: result.owner,
          media: result.principalMedia || null,
          objectId: info.sharedObjectId,
          sharedKey: info.sharedKey,
          date: info.created // TODO use the share date instead...
        };

        report['link'] = `/user/synthesis/${report.objectId}/${report.sharedKey}`;

        this._totalReports.push(report);

        }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
      })
      );
    });
  }


  /***
   * here we are getting the link.
   * @param report
   * @returns {string}
   */
  public getRelevantLink(report: any): string {
    if (report) {
      return `${environment.clientUrl}${report.link}`;
    } else {
      return '#';
    }
  }


  /***
   * this function is to get the principal media of the innovation.
   * @param report
   * @returns {string}
   */
  public getMedia(report: any): string {
    if (report.media) {
      return InnovationFrontService.getMediaSrc(report.media, 'mediaSrc', '120', '100');
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/c_fill,h_100,w_120/v1542811700/app/default-images/icons/no-image.png';
    }
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get totalReports(): any {
    return this._totalReports;
  }

  get config(): { fields: string; limit: string; offset: string; search: string; sort: string } {
    return this._config;
  }

  get subscriptions(): any[] {
    return this._subscriptions;
  }

  get noResult(): boolean {
    return this._noResult;
  }

  ngOnDestroy(): void {
    this._cleanSubs();
  }

  /**
   * Remove all subscriptions
   * @user
   */
  private _cleanSubs() {
    this._subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

}
