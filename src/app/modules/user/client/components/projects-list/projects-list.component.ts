import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-projects-list',
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

  private _innovations: Array<Innovation>;

  private _total: number;

  private _innovationId: string;

  private _deleteModal = false;

  private _config: any = {
    fields: 'name created updated status collaborators principalMedia',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created" :-1}'
  };

  private _pagination: Pagination;

  private _noResult = false;

  constructor(private translateService: TranslateService,
              private userService: UserService,
              private translateTitleService: TranslateTitleService,
              private translateNotificationService: TranslateNotificationsService,
              private innovationService: InnovationService) {

    this.translateTitleService.setTitle('PROJECT_MODULE.PROJECTS_LIST.TITLE');

  }

  ngOnInit() {
    this.loadProjects();
    this._setPagination();
  }

  private loadProjects() {
    this.userService.getMyInnovations(this._config).pipe(first()).subscribe((responses: any) => {
      this._innovations = responses.result;
      this._total = responses._metadata.totalCount;
      this._noResult = responses._metadata.totalCount === 0;
    }, () => {
      this.translateNotificationService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }

  private _setPagination() {
    this.pagination = {
      propertyName: 'client-projects',
      offset: Number(this._config.offset),
      currentPage: this._pagination && this._pagination.currentPage ? this._pagination.currentPage : 1,
      previousPage: this._pagination && this._pagination.previousPage ? this._pagination.previousPage : 0,
      nextPage: this._pagination && this._pagination.nextPage ? this._pagination.nextPage : 2,
    };
  }


  getRelevantLink(innovation: Innovation): Array<string> {
    const link = [innovation._id];

    switch (innovation.status) {
      case 'DONE':
        link.push('synthesis');
        break;
      case 'EVALUATING':
        link.push('exploration');
        break;
      default:
        link.push('setup');
    }
    return link;

  }


  getImage(innovation: Innovation): string {
    if (innovation.principalMedia) {

      if (innovation.principalMedia.type === 'PHOTO') {
        return 'https://res.cloudinary.com/umi/image/upload/c_scale,h_100,w_120/' + innovation.principalMedia.cloudinary.public_id;
      }
      else {
        return innovation.principalMedia.video.thumbnail;
      }

    } else {
      const findIndex = innovation.innovationCards.findIndex((card) => card.lang === this.translateService.currentLang);
      return InnovationFrontService.getMediaSrc(innovation.innovationCards[findIndex], 'default', '120', '100');
    }

  }


  onClickDelete(event: Event, innovationId: string) {
    event.preventDefault();
    this._innovationId = innovationId;
    this._deleteModal = true;
  }


  closeModal(event: Event) {
    event.preventDefault();
    this._deleteModal = false;
    this._innovationId = '';
  }


  onClickSubmit(event: Event) {
    event.preventDefault();

    this.innovationService.remove(this._innovationId).pipe(first()).subscribe((response: any) => {
      this.translateNotificationService.success('ERROR.PROJECT.DELETED', 'ERROR.PROJECT.DELETED_PROJECT_TEXT');
      this.loadProjects();
      this.closeModal(event);
    }, (err: any) => {
      this.translateNotificationService.error('ERROR.ERROR', 'ERROR.PROJECT.NOT_DELETED_TEXT');
    });

  }


  configChange(value: any) {
    this._config.limit = value.limit;
    this._config.offset = value.offset;
    this.loadProjects();
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

    if (this._pagination.parPage && this._pagination.offset) {
      this._config.limit = this._pagination.parPage.toString(10);
      this._config.offset = this._pagination.offset.toString(10);
    }

    this.loadProjects();
  }

  get total () {
    return this._total;
  }

  get innovations () {
    return this._innovations;
  }

  get innovationId(): string {
    return this._innovationId;
  }

  get deleteModal(): boolean {
    return this._deleteModal;
  }

  set deleteModal(value: boolean) {
    this._deleteModal = value;
  }

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get noResult(): boolean {
    return this._noResult;
  }

}
