import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Subject } from 'rxjs/Subject';
import { Innovation } from '../../../../models/innovation';
import { User } from '../../../../models/user.model';
import {Table} from '../../../table/models/table';

@Component({
  selector: 'app-admin-projects-list',
  templateUrl: './admin-projects-list.component.html',
  styleUrls: ['./admin-projects-list.component.scss']
})
export class AdminProjectsListComponent implements OnInit, OnDestroy {

  @Input() status: string;
  @Input() operators: Array<User>;
  @Input() operatorId: string; // Filtrer les résultats pour un utilisateur en particulier
  @Input() refreshNeededEmitter: Subject<any>;
  private _projects: Array<Innovation> = [];
  public selectedProjectIdToBeDeleted: any = null;
  private _tableInfos: Table = null;
  private _total = 0;
  private _config: any;


  constructor(private _translateService: TranslateService,
              private _notificationService: TranslateNotificationsService,
              private _innovationService: InnovationService) {}

  ngOnInit(): void {
    this.build();
    if (this.refreshNeededEmitter) {
      this.refreshNeededEmitter.subscribe((data) => {
        if (typeof data.operatorId !== 'undefined') {
          this.operatorId = data.operatorId;
        }
        this.build();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.refreshNeededEmitter) {
      this.refreshNeededEmitter.unsubscribe();
    }
  }

  build (): void {
    this._projects = [];
    this._config = {
      fields: '',
      limit: 10,
      offset: 0,
      search: {},
      sort: {
        created: -1
      }
    };
    switch (this.status) {
      case 'PREPARING': {
        this._config.status = {$in: ['EDITING', 'SUBMITTED']};
        if (this.operatorId && this.operatorId !== '') {
          this._config.operator = this.operatorId;
        }
        else {
          this._config.operator = {$exists: true};
        }
        this._config.sort = {
          status: -1 // SUBMITTED est prioritaire
        };
        break;
      }
      case 'WITHOUT_OPERATOR': {
        this._config.operator = null;
        break;
      }
      case 'DONE': {
        this._config.status = {$in: ['DONE', 'EVALUATING_DONE']};
        if (this.operatorId && this.operatorId !== '') {
          this._config.operator = this.operatorId;
        }
        break;
      }
      default: {
        this._config.status = this.status;
        if (this.operatorId && this.operatorId !== '') {
          this._config.operator = this.operatorId;
        }
        this._config.sort = {
          launched: 1
        };
      }
    }
    this.loadProjects(this._config);
  }

  ratio(value1: number, value2: number): any {
    if (value2 === 0) {
      return value1 === 0 ? 0 : 'NA';
    } else {
      return Math.round(100 * value1 / value2);
    }
  };

  loadProjects(config?: any): void {
    if (config) {
      this._config = config;
    }
    this._innovationService.getAll(this._config)
      .first()
      .subscribe(projects => {
        this._projects = projects.result.map((project: Innovation) => {
          if (!project.stats) {
            project.stats = {
              pros: 0,
              answers: 0,
              submittedAnswers: 0,
              emailsOK: 0,
              received: 0,
              opened: 0,
              clicked: 0
            }
          }
          return project;
        });
        this._total = projects._metadata.totalCount;

        this._tableInfos = {
          _selector: 'admin-projects',
          _title: 'COMMON.PROJECTS',
          _content: this._projects,
          _total: this._total,
          _isFiltrable: true,
          _isHeadable: true,
          _columns: [
            {_attrs: ['name'], _name: 'COMMON.PROJECTS', _type: 'TEXT'},
            {_attrs: ['type'], _name: 'COMMON.TYPE', _type: 'MULTI-CHOICES',
              _choices: [
                {_name: 'apps', _url: 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-apps.svg'},
                {_name: 'insights', _url: 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-insights.svg'},
                {_name: 'leads', _url: 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-leads.svg'}
              ]}]
        };
      });
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removeProject(event: Event, projectId: string) {
    event.preventDefault();
    this._innovationService
      .remove(projectId)
      .first()
      .subscribe(_ => {
        this._projects.splice(this._getProjectIndex(projectId), 1);
        this.selectedProjectIdToBeDeleted = null;
      });
  }

  public getRelevantLink (project: Innovation) { // routerLink : /projects/:project_id
    const link = 'projects/project/' + project._id;
    switch (project.status) {
      case 'DONE':
      case 'EVALUATING':
        return link + '/synthesis';
      // case 'SUBMITTED':
      //   return link;
      default:
        return link;
    }
  }

  private _getProjectIndex(projectId: string): number {
    for (const project of this._projects) {
      if (projectId === project._id) {
        return this._projects.indexOf(project);
      }
    }
  }

  public getPrincipalMedia(project: Innovation): string {
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

  public getDelai (date: Date) {
    const delai = 8; // On se donne 8 jours à compter de la validation du projet
    const today: Date = new Date();
    date = date || new Date('1970');
    if (!date.getTime) {
      date = new Date(date);
    }
    const time = delai - Math.round((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return time;
  }

  public updateThanksState(event: Event, project: Innovation): void {
    event.preventDefault();
    this._innovationService.save(project._id, {thanks: !project.thanks})
      .first()
      .subscribe(data => {
        project.thanks = data.thanks;
      });
  }

  public updateRestitutionState(event: Event, project: Innovation): void {
    event.preventDefault();
    this._innovationService.save(project._id, {restitution: !project.restitution})
      .first()
      .subscribe(data => {
        project.restitution = data.restitution;
      });
  }

  public setOperator (operatorId: string, project: Innovation) {
    if (operatorId) {
      this._innovationService.setOperator(project._id, operatorId)
          .first()
          .subscribe(_ => {
            this._notificationService.success('Opérateur affecté', 'OK');
          });
    }
  }

  public disableOperatorsList(): boolean {
    return this.operators.length === 0;
  }

  public seeMore (event: Event) {
    event.preventDefault();
    this.loadProjects();
  }

  set config(value: any) { this._config = value; }
  get config() { return this._config; }
  get total () { return this._total; }
  get projects () { return this._projects; }
  get tableInfos(): Table { return this._tableInfos; }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
}
