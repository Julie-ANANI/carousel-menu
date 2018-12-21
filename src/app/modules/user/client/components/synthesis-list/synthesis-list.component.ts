import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user/user.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { environment } from '../../../../../../environments/environment';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { Share } from '../../../../../models/share';

@Component({
  selector: 'app-synthesis-list',
  templateUrl: './synthesis-list.component.html',
  styleUrls: ['./synthesis-list.component.scss']
})

export class SynthesisListComponent implements OnInit, OnDestroy {

  private _subscriptions = Array<any>();

  private _totalReports: any = [];

  private _displaySpinner = true;

  private _config = {
    fields: 'name,owner,principalMedia',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  constructor( private userService: UserService,
               private innovationService: InnovationService,
               private translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this.getUserReports();
    this._displaySpinner = false;
  }

  private getUserReports() {
    this._subscriptions.push(this.userService.getSharedWithMe(this.config).subscribe((reports: any) => {
      this.getSharedReports(reports.sharedgraph || []);
    }));
  }

  /***
   * This function is getting the shared reports of the user and we are
   * pushing those to totalReports variable.
   */
  private getSharedReports(recievedReports: any) {
    recievedReports.forEach((info: Share) => {
      this._subscriptions.push(this.innovationService.get(info.sharedObjectId, this.config).subscribe(result => {
          const report: Share = {
            name: result.name,
            owner: result.owner,
            media: result.principalMedia || null,
            objectId: info.sharedObjectId,
            sharedKey: info.sharedKey,
            date: info.created // TODO use the share date instead...
          };
          report['link'] = `/synthesis/${report.objectId}/${report.sharedKey}`;
          this._totalReports.push(report);
        }, () => {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
        })
      );
    });
  }

  /***
   * Here we are getting the link.
   * @param report
   * @returns {string}
   */
  getRelevantLink(report: any): string {
    if (report) {
      return `${environment.clientUrl}${report.link}`;
    } else {
      return '#';
    }
  }

  /***
   * This function is to get the principal media of the innovation.
   * @param report
   * @returns {string}
   */
  getMedia(report: any) {
    let src = 'https://res.cloudinary.com/umi/image/upload/app/no-image.png';

    if (report.media && report.media.type === 'PHOTO') {
      src = report.media.url;
    }
    return src;
  }

  get totalReports(): any {
    return this._totalReports;
  }

  get displaySpinner(): boolean {
    return this._displaySpinner;
  }

  get config(): { fields: string; limit: string; offset: string; search: string; sort: string } {
    return this._config;
  }

  get subscriptions(): any[] {
    return this._subscriptions;
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
