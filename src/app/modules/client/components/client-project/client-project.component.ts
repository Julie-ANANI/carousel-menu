import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { Innovation } from '../../../../models/innovation';
import { Subject } from 'rxjs/Subject';
import { Template } from '../../../sidebar/interfaces/template';

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

  sidebarTemplateValue: Template = {};
  sidebarState = new Subject<string>();

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

    this.titleService.setTitle(this._project.name);

    // Getting the project type
    switch (this._project.type) {
      case 'leads':
        this._imgType = 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-leads.svg';
        break;
      case 'apps':
        this._imgType = 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-apps.svg';
        break;
      case 'insights':
        this._imgType = 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-insights.svg';
        break;
    }

  }

  addCollaborators (event: any): void {
    this._project.collaborators = this._project.collaborators.concat(event);
  }

  editCollaborator(event: Event) {
    event.preventDefault();

    this.sidebarTemplateValue = {
      animate_state: this.sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'PROJECT_MODULE.ADD_COLLABORATORS_MODAL.TITLE'
    };

  }

  closeSidebar(value: string) {
    this.sidebarTemplateValue.animate_state = value;
    this.sidebarState.next(this.sidebarTemplateValue.animate_state);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this._scrollButton = (this.getCurrentScrollTop() > 10);
  }

  getCurrentScrollTop() {
    if (typeof window.scrollY !== 'undefined' && window.scrollY >= 0) {
      return window.scrollY;
    }
    return 0;
  };

  scrollToTop(event: Event) {
    event.preventDefault();
    window.scrollTo(0, 0);
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

}

