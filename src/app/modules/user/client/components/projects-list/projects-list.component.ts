import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { UserService } from '../../../../../services/user/user.service';
import { Innovation } from '../../../../../models/innovation';
import { PaginationInterface } from '../../../../utility-components/pagination/interfaces/pagination';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import {InnovationService} from '../../../../../services/innovation/innovation.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: 'projects-list.component.html',
  styleUrls: ['projects-list.component.scss'],
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

export class ProjectsListComponent implements OnInit {

  private _innovations: Array<Innovation>;

  private _total: number;

  innovationId: string;

  deleteModal = false;

  private _config = {
    fields: 'name created updated status collaborators principalMedia',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created" :-1}'
  };

  private _paginationConfig: PaginationInterface = {
    limit: this._config.limit,
    offset: this._config.offset
  };

  constructor(private translateService: TranslateService,
              private userService: UserService,
              private translateTitleService: TranslateTitleService,
              private translateNotificationService: TranslateNotificationsService,
              private innovationService: InnovationService) {}

  ngOnInit() {
    this.translateTitleService.setTitle('PROJECT_MODULE.PROJECTS_LIST.TITLE');
    this.loadProjects();
  }


  private loadProjects() {
    this.userService.getMyInnovations(this._config).pipe(first()).subscribe((responses: any) => {
        this._innovations = responses.result;
        this._total = responses._metadata.totalCount;
    }, () => {
      this.translateNotificationService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
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
        return 'https://res.cloudinary.com/umi/image/upload/c_scale,h_260,w_260/' + innovation.principalMedia.cloudinary.public_id;
      }
      else {
        return innovation.principalMedia.video.thumbnail;
      }

    } else {
      return 'https://res.cloudinary.com/umi/image/upload/v1542811700/app/default-images/icons/no-image.png';
    }

  }


  onClickDelete(event: Event, innovationId: string) {
    event.preventDefault();
    this.innovationId = innovationId;
    this.deleteModal = true;
  }


  closeModal(event: Event) {
    event.preventDefault();
    this.deleteModal = false;
    this.innovationId = '';
  }


  onClickSubmit(event: Event) {
    event.preventDefault();

    this.innovationService.remove(this.innovationId).pipe(first()).subscribe((response: any) => {
      this.translateNotificationService.success('ERROR.PROJECT.DELETED', 'ERROR.PROJECT.DELETED_PROJECT_TEXT');
      this.loadProjects();
      this.closeModal(event);
    }, (err: any) => {
      this.translateNotificationService.error('ERROR.ERROR', 'ERROR.PROJECT.NOT_DELETED_TEXT');
    });

  }


  configChange(value: any) {
    window.scroll(0, 0);
    this._paginationConfig = value;
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

  get total () {
    return this._total;
  }

  get innovations () {
    return this._innovations;
  }

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get paginationConfig(): PaginationInterface {
    return this._paginationConfig;
  }

}
