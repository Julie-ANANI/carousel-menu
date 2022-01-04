import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { UserService } from '../../../../../services/user/user.service';
import { Innovation } from '../../../../../models/innovation';
import { Pagination } from '../../../../utility/paginations/interfaces/pagination';
import { TranslateNotificationsService } from '../../../../../services/translate-notifications/translate-notifications.service';
import { first } from 'rxjs/operators';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { Config } from '@umius/umi-common-component/models';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import {CommonService} from '../../../../../services/common/common.service';

@Component({
  templateUrl: 'projects-list.component.html',
  styleUrls: ['projects-list.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('100ms', [
          animate('200ms ease-in-out', keyframes([
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

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  private _innovations: Array<Innovation> = [];

  private _total = 0;

  private _deleteModal = false;

  private _isError = false;

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
              private _translateService: TranslateService,
              private _commonService: CommonService,
              private _userService: UserService,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationService: TranslateNotificationsService,
              private _innovationService: InnovationService) {
    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.MY_PROJECTS');
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._getProjects();
    }
  }

  /***
   * this is to get the innovations from the api.
   * @private
   */
  private _getProjects() {
    this._userService.getMyInnovations(this._config).pipe(first()).subscribe((response) => {
      this._isError = false;
      this._innovations = response.result;
      this._total = Math.max(response._metadata.totalCount, response.result.length);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      this._isError = true;
      console.error(err);
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
    return InnovationFrontService.principalMedia(innovation, this.currentLang);
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
      this._innovations = this._innovations.filter((innovation) => innovation._id !== this._removeInnovationId);
      this._translateNotificationService.success('ERROR.SUCCESS', 'ERROR.PROJECT.DELETED_PROJECT_TEXT');
      this.closeModal(event);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  set config(value: Config) {
    this._config = value;
  }

  get config(): Config {
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

  get total(): number {
    return this._total;
  }

  get innovations(): Array<Innovation> {
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
    return this._commonService.dateFormat();
  }

}
