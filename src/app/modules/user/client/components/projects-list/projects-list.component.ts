import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { UserService } from '../../../../../services/user/user.service';
import { Innovation } from '../../../../../models/innovation';
import { Pagination } from '../../../../utility-components/paginations/interfaces/pagination';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { SpinnerService } from '../../../../../services/spinner/spinner';
import { Config } from '../../../../../models/config';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../services/error/error-front';

@Component({
  selector: 'projects-list',
  templateUrl: 'projects-list.component.html',
  styleUrls: ['projects-list.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('300ms ease-in-out', keyframes([
              style({ opacity: 0, transform: 'translateX(-20%)', offset: 0 }),
              style({ opacity: 1, transform: 'translateX(0)',     offset: 1.0 }),
            ])
          )]
        ), { optional: true }),

      ])
    ])
  ]
})

export class ProjectsListComponent implements OnInit {

  private _innovations: Array<Innovation> = [];

  private _total = 0;

  private _deleteModal = false;

  private _isError = false;

  private _dateFormat = '';

  private _config: Config = {
    fields: 'name created updated status collaborators principalMedia innovationCards',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created" :-1}'
  };

  private _pagination: Pagination = {
    propertyName: 'client-projects',
    offset: Number(this._config.offset)
  };

  private _removeInnovationId = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _spinnerService: SpinnerService,
              private _translateService: TranslateService,
              private _userService: UserService,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationService: TranslateNotificationsService,
              private _innovationService: InnovationService) {

    this._setSpinner(true);
    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.MY_PROJECTS');

  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._dateFormat = this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
      this._getProjects();
    }
  }

  /***
   * this is to start/stop the full page spinner.
   * @param value
   * @private
   */
  private _setSpinner(value: boolean) {
    this._spinnerService.state(value);
  }

  /***
   * this is to get the innovations from the api.
   * @private
   */
  private _getProjects() {
    this._userService.getMyInnovations(this._config).pipe(first()).subscribe((response) => {
      this._setSpinner(false);
      this._innovations = response.result;
      this._total = Math.max(response._metadata.totalCount, response.result.length);
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this._isError = true;
      this._setSpinner(false);
      this._translateNotificationService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status))
    });
  }

  /***
   * get the link based on the status of the innovations.
   * @param innovation
   */
  public getRelevantLink(innovation: Innovation): Array<string> {
    const link = [innovation._id];

    switch (innovation.status) {

      case 'DONE':
        link.push('synthesis');
        break;

      case 'EVALUATING':
        link.push('exploration');
        break;

      default:
        link.push('settings');
    }

    return link;

  }

  /***
   * check if the principal media return that otherwise take the media according to the current lang.
   * @param innovation
   */
  public getImage(innovation: Innovation): string {
    if (innovation.principalMedia) {

      if (innovation.principalMedia.type === 'PHOTO') {
        return 'https://res.cloudinary.com/umi/image/upload/c_scale,h_100,w_120/' + innovation.principalMedia.cloudinary.public_id;
      }
      else {
        return innovation.principalMedia.video.thumbnail;
      }

    } else {
      const findIndex = innovation.innovationCards.findIndex((card) => card.lang === this._translateService.currentLang);
      return InnovationFrontService.getMediaSrc(innovation.innovationCards[findIndex], 'default', '120', '100');
    }

  }

  public onClickDelete(event: Event, innovationId: string) {
    event.preventDefault();
    this._removeInnovationId = innovationId;
    this._deleteModal = true;
  }

  public closeModal(event: Event) {
    event.preventDefault();
    this._deleteModal = false;
  }

  public onClickSubmit(event: Event) {
    event.preventDefault();

    this._innovationService.remove(this._removeInnovationId).pipe(first()).subscribe(() => {
      this._translateNotificationService.success('ERROR.PROJECT.DELETED', 'ERROR.PROJECT.DELETED_PROJECT_TEXT');
      this._innovations = this._innovations.filter((innovation) => innovation._id !== this._removeInnovationId);
      this.closeModal(event);
    }, (err: any) => {
      this._translateNotificationService.error('ERROR.ERROR', 'ERROR.PROJECT.NOT_DELETED_TEXT');
    });

  }

  set config(value: any) {
    this._config = value;
  }

  get config(): any {
    return this._config;
  }

  get pagination(): Pagination {
    return this._pagination;
  }

  set pagination(value: Pagination) {
    this._pagination = value;
    this._config.limit = this._pagination.parPage ? this._pagination.parPage.toString(10) : '10';
    this._config.offset = this._pagination.offset ? this._pagination.offset.toString(10) : '0';
    this._getProjects();
  }

  get total () {
    return this._total;
  }

  get innovations () {
    return this._innovations;
  }

  get deleteModal(): boolean {
    return this._deleteModal;
  }

  set deleteModal(value: boolean) {
    this._deleteModal = value;
  }

  get isError(): boolean {
    return this._isError;
  }

  get dateFormat(): string {
    return this._dateFormat;
  }

}
