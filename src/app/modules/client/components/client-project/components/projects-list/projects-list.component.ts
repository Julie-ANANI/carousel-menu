import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { UserService } from '../../../../../../services/user/user.service';
import { Innovation } from '../../../../../../models/innovation';
import { PaginationTemplate } from '../../../../../../models/pagination';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: 'projects-list.component.html',
  styleUrls: ['projects-list.component.scss']
})

export class ProjectsListComponent implements OnInit {

  private _projects: Array<Innovation>;

  private _total: number;

  displaySpinner = true;

  private _config = {
    fields: 'name created updated status collaborators principalMedia',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  private _paginationConfig: PaginationTemplate = {limit: this._config.limit, offset: this._config.offset};

  constructor(private translateService: TranslateService,
              private userService: UserService,
              private translateTitleService: TranslateTitleService,
              private translateNotificationService: TranslateNotificationsService) {}

  ngOnInit() {
    this.translateTitleService.setTitle('PROJECT_MODULE.PROJECTS_LIST.TITLE');
    this.loadProjects();
  }

  private loadProjects() {
    this.userService.getMyInnovations(this._config).first().subscribe((responses: any) => {
        this._projects = responses.result;
        this._total = responses._metadata.totalCount;
    }, () => {
      this.translateNotificationService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    }, () => {
      this.displaySpinner = false;
    });
  }

  getRelevantLink(project: Innovation): Array<string> {
    const link = ['/project', project._id];

    switch (project.status) {
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

  getMedia(project: Innovation): string {
    if (project.principalMedia) {

      if (project.principalMedia.type === 'PHOTO') {
        return 'https://res.cloudinary.com/umi/image/upload/c_scale,h_260,w_260/' + project.principalMedia.cloudinary.public_id;
      }
      else {
        return project.principalMedia.video.thumbnail;
      }

    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/no-image.png';
    }

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

  get projects () {
    return this._projects;
  }

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get paginationConfig(): PaginationTemplate {
    return this._paginationConfig;
  }

}
