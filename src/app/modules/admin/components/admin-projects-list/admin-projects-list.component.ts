import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Innovation } from '../../../../models/innovation';
import {Table} from '../../../table/models/table';
import {FrontendService} from '../../../../services/frontend/frontend.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-projects-list',
  templateUrl: './admin-projects-list.component.html',
  styleUrls: ['./admin-projects-list.component.scss']
})
export class AdminProjectsListComponent implements OnInit, OnDestroy {
  @Input() operatorId: string; // Filtrer les résultats pour un utilisateur en particulier
  @Input() refreshNeededEmitter: Subject<any>;

  private _projects: Array<Innovation> = [];
  public selectedProjectIdToBeDeleted: any = null;
  private _tableInfos: Table = null;
  private _total = 0;
  private _config: any;


  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _frontendService: FrontendService) {}

  ngOnInit(): void {
    this.build();
    if (this.refreshNeededEmitter) {
      this.refreshNeededEmitter.subscribe((data: any) => {
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
    if (this.operatorId && this.operatorId !== '') {
      this._config.operator = this.operatorId;
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
      .pipe(first())
      .subscribe((projects: any) => {
        this._projects = projects.result.map((project: Innovation) => {
          if (project._metadata) {
            this._frontendService.calculateInnovationMetadataPercentages(project, 'preparation');
            this._frontendService.calculateInnovationMetadataPercentages(project, 'campaign');
            this._frontendService.calculateInnovationMetadataPercentages(project, 'delivery');
            project['percentages'] = JSON.parse(JSON.stringify(this._frontendService.innovationMetadataCalculatedValues));
          } else {
            project['percentages'] = {preparation: 0, campaign: 0, delivery: 0};
          }
          return project;
        });
        this._total = projects._metadata.totalCount;

        this._tableInfos = {
          _selector: 'admin-projects',
          _title: 'COMMON.PROJECTS',
          _content: this._projects,
          _total: this._total,
          _isShowable: true,
          _isFiltrable: true,
          _isHeadable: true,
          _columns: [
            {_attrs: ['name'], _name: 'COMMON.PROJECTS', _type: 'TEXT'},
            {_attrs: ['type'], _name: 'COMMON.TYPE', _type: 'MULTI-CHOICES',
              _choices: [
                {_name: 'apps', _url: 'https://res.cloudinary.com/umi/image/upload/v1539157942/app/default-images/offers/get-apps.svg'},
                {_name: 'insights', _url: 'https://res.cloudinary.com/umi/image/upload/v1539158153/app/default-images/offers/get-insights.svg'},
                {_name: 'leads', _url: 'https://res.cloudinary.com/umi/image/upload/v1539157943/app/default-images/offers/get-leads.svg'}
              ]},
            {_attrs: ['percentages.preparation'], _name: 'Preparation', _type: 'PROGRESS'},
            {_attrs: ['percentages.campaign'], _name: 'PROJECT.CAMPAIGN.CAMPAIGN', _type: 'PROGRESS'},
            {_attrs: ['percentages.delivery'], _name: 'PROJECT.DELIVERY.DELIVERY', _type: 'PROGRESS'},
          ]
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
      .pipe(first())
      .subscribe((_: any) => {
        this._projects.splice(this._getProjectIndex(projectId), 1);
        this.selectedProjectIdToBeDeleted = null;
      });
  }

  public getRelevantLink (project: Innovation) { // routerLink : /projects/:project_id
    const link = '/admin/projects/project/' + project._id;
    return link;
  }

  goToProject(project: Innovation) {
    // this._router.navigate([this.getRelevantLink(project)]);
    window.open(this.getRelevantLink(project), '_blank')
  }

  private _getProjectIndex(projectId: string): number {
    for (const project of this._projects) {
      if (projectId === project._id) {
        return this._projects.indexOf(project);
      }
    }
  }

  set config(value: any) { this._config = value; }
  get config() { return this._config; }
  get total () { return this._total; }
  get projects () { return this._projects; }
  get tableInfos(): Table { return this._tableInfos; }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
}
