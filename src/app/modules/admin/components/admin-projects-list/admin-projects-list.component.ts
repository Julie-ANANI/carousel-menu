import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-admin-projects-list',
  templateUrl: './admin-projects-list.component.html',
  styleUrls: ['./admin-projects-list.component.scss']
})
export class AdminProjectsListComponent implements OnInit, OnDestroy {

  @Input() status: string;
  @Input() operators: any[];
  @Input() operatorId: string; // Filtrer les résultats pour un utilisateur en particulier
  @Input() refreshNeededEmitter: Subject<any>;
  private _projects: any[];
  public selectedProjectIdToBeDeleted: any = null;
  private _total: number;
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

  build () {
    this._config = {
      fields: '',
      limit: 5,
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
        // TODO trier par jours restants pour les projets en cours
      }
    }
    this.loadProjects(this._config);
  }

  ratio(value1: number, value2: number): any {
    if (value2 == 0) {
      return value1 == 0 ? 0 : 'NA';
    } else {
      return Math.round(100 * value1 / value2);
    }
  };

  loadProjects(config: any): void {
    this._config = config;
    this._innovationService.getAll(this._config).subscribe(projects => {
      this._projects = projects.result.map(project => {
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
        } else {
          project.receivedRatio = this.ratio(project.stats.received, project.stats.emailsOK);
          project.openedRatio = this.ratio(project.stats.opened, project.stats.received);
          project.clickedRatio = this.ratio(project.stats.clicked, project.stats.opened);
        }
        return project;
      });
      this._total = projects._metadata.totalCount;
    });
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removeProject(projectId) {
    this._innovationService
      .remove(projectId)
      .subscribe(projectRemoved => {
        this._projects.splice(this._getProjectIndex(projectId), 1);
        this.selectedProjectIdToBeDeleted = null;
      });
  }

  public getRelevantLink (project) { // routerLink : /projects/:project_id
    const link = '../projects/' + project._id;
    switch (project.status) {
      case 'DONE':
      case 'EVALUATING':
        return link + '/synthesis';
      // case 'SUBMITTED':
      //   return link;
      default:
        return link + '/edit';
    }
  }

  private _getProjectIndex(projectId: string): number {
    for (const project of this._projects) {
      if (projectId === project._id) {
        return this._projects.indexOf(project);
      }
    }
  }

  public getPrincipalMedia(project): string {
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

  public setOperator (operatorId, project) {
    this._innovationService.setOperator(project._id, operatorId).subscribe(data => {
      this._notificationService.success('Opérateur affecté', data.message);
    });
  }

  public seeMore () {
    // TODO
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
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }
}
