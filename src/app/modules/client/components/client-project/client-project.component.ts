import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { Innovation } from '../../../../models/innovation';
import { Subject } from 'rxjs';
import { SidebarInterface } from '../../../sidebar/interfaces/sidebar-interface';

const DEFAULT_PAGE = 'setup';

@Component({
  selector: 'app-client-project',
  templateUrl: './client-project.component.html',
  styleUrls: ['./client-project.component.scss']
})

export class ClientProjectComponent implements OnInit {

  private _project: Innovation;
  private _imgType: string;
  private _currentPage: string;
  private _scrollButton = false;
  private _sidebarTemplateValue: SidebarInterface = {};
  private _sidebarState = new Subject<string>();

  constructor(private activatedRoute: ActivatedRoute,
              private titleService: TranslateTitleService,
              private router: Router) {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

  }

  ngOnInit() {
    const url = this.router.routerState.snapshot.url.split('/');
    this._currentPage = url ? url[3] || DEFAULT_PAGE : DEFAULT_PAGE;

    this._project = this.activatedRoute.snapshot.data['innovation'];

    this.titleService.setTitle(this._project.name || 'Project');

    // Getting the projects-list type
    this._imgType = `https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-${this._project.type}.svg`;

  }

  addCollaborators (event: any): void {
    this._project.collaborators = this._project.collaborators.concat(event);
  }

  editCollaborator(event: Event) {
    event.preventDefault();

    this._sidebarTemplateValue = {
      animate_state: this._sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'PROJECT_MODULE.ADD_COLLABORATORS_MODAL.TITLE'
    };

  }

  closeSidebar(value: string) {
    this._sidebarTemplateValue.animate_state = value;
    this._sidebarState.next(this._sidebarTemplateValue.animate_state);
  }

  get project() {
    return this._project;
  }

  get scrollButton(): boolean {
    return this._scrollButton;
  }

  get currentPage(): string {
    return this._currentPage;
  }

  get imgType(): string {
    return this._imgType;
  }

  get sidebarTemplateValue(): SidebarInterface {
    return this._sidebarTemplateValue;
  }

  set sidebarTemplateValue(value: SidebarInterface) {
    this._sidebarTemplateValue = value;
  }

  get sidebarState(): Subject<string> {
    return this._sidebarState;
  }

  set sidebarState(value: Subject<string>) {
    this._sidebarState = value;
  }

}

