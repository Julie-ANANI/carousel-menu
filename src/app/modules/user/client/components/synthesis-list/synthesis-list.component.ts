import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user/user.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { environment } from '../../../../../../environments/environment';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { Share } from '../../../../../models/share';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import {TranslateTitleService} from '../../../../../services/title/title.service';

@Component({
  selector: 'app-synthesis-list',
  templateUrl: './synthesis-list.component.html',
  styleUrls: ['./synthesis-list.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('800ms ease-in-out', keyframes([
              style({ opacity: 0, transform: 'translateX(-20%)', offset: 0 }),
              style({ opacity: 1, transform: 'translateX(0)',     offset: 1.0 }),
            ])
          )]
        ), { optional: true }),

      ])
    ])
  ]
})

export class SynthesisListComponent implements OnInit, OnDestroy {

  private _subscriptions = Array<any>();

  private _totalReports: any = [];

  private _config = {
    fields: 'name owner principalMedia',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  constructor( private translateTitleService: TranslateTitleService,
               private userService: UserService,
               private innovationService: InnovationService,
               private translateNotificationsService: TranslateNotificationsService,
               private translateService: TranslateService) { }

  ngOnInit() {
    this.translateTitleService.setTitle('COMMON.SHARED_SYNTHESIS');
    this.getUserReports();
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
  private getSharedReports(receivedReports: any) {
    receivedReports.forEach((info: Share) => {
      this._subscriptions.push(this.innovationService.get(info.sharedObjectId, this.config).subscribe(result => {
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

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
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
