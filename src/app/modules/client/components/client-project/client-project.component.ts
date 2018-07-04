import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Innovation } from '../../../../models/innovation';

const DEFAULT_PAGE = 'setup';

@Component({
  selector: 'app-client-project',
  templateUrl: './client-project.component.html',
  styleUrls: ['./client-project.component.scss']
})

export class ClientProjectComponent implements OnInit {

  @Input() project: Innovation;

  sidebarAnimateState: string;

  private _imgType: string;
  private _currentPage: string;
  private _scrollButton = false;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

  }

  ngOnInit() {
    const url = this.router.routerState.snapshot.url.split('/');

    this._currentPage = url ? url[3] || DEFAULT_PAGE : DEFAULT_PAGE;

    if (!this.project) {
      this.project = this.activatedRoute.snapshot.data['innovation'];
    }

    // Getting the project type
    if (this.project.type === 'leads') {
      this._imgType = 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-leads.svg';
    } else if (this.project.type === 'apps') {
      this._imgType = 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-apps.svg';
    } else {
      this._imgType = 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-insights.svg';
    }

  }

  addCollaborators (event: any): void {
    this.project.collaborators = this.project.collaborators.concat(event);
  }

  editCollaborator(event: Event) {
    event.preventDefault();
    this.sidebarAnimateState = this.sidebarAnimateState === 'active' ? 'inactive' : 'active' ;
  }

  closeSidebar(value: string) {
    this.sidebarAnimateState = value;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.getCurrentScrollTop() > 10) {
      this._scrollButton = true;
    } else {
      this._scrollButton = false;
    }
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

