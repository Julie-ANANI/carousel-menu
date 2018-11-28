import {Component, OnDestroy, OnInit} from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// const DEFAULT_PAGE = 'setup';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit, OnDestroy {

  innovation: Innovation = {};

  ngUnsubscribe: Subject<any> = new Subject();

  offerTypeImage = '';

  // private _project: Innovation;
  // private _imgType: string;
  // private _currentPage: string;
  // private _scrollButton = false;
  // private _sidebarTemplateValue: SidebarInterface = {};
  // private _sidebarState = new Subject<string>();

  constructor(private activatedRoute: ActivatedRoute,
              private translateTitleService: TranslateTitleService,) {
    // override the route reuse strategy
    /*this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };*/
    /*private activatedRoute: ActivatedRoute,

              private router: Router*/
    this.activatedRoute.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      if (response) {
        this.innovation = response.innovation;
      }
    });


  }


  ngOnInit() {
    this.translateTitleService.setTitle(this.innovation.name || 'Project');
    this.loadOfferType();
    console.log(this.innovation);
  }


  private loadOfferType() {
    switch (this.innovation.type) {

      case 'insights':
        this.offerTypeImage = 'https://res.cloudinary.com/umi/image/upload/v1539158153/app/default-images/offers/get-insights.svg';
        break;

      case 'apps':
        this.offerTypeImage = 'https://res.cloudinary.com/umi/image/upload/v1539157942/app/default-images/offers/get-apps.svg';
        break;

      case 'leads':
        this.offerTypeImage = 'https://res.cloudinary.com/umi/image/upload/v1539157943/app/default-images/offers/get-leads.svg';
        break;

      default:
        // do nothing.
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // addCollaborators (event: any): void {
  //   this._project.collaborators = this._project.collaborators.concat(event);
  // }
  //
  // editCollaborator(event: Event) {
  //   event.preventDefault();
  //
  //   this._sidebarTemplateValue = {
  //     animate_state: this._sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
  //     title: 'PROJECT_MODULE.ADD_COLLABORATORS_MODAL.TITLE'
  //   };
  //
  // }
  //
  // closeSidebar(value: string) {
  //   this._sidebarTemplateValue.animate_state = value;
  //   this._sidebarState.next(this._sidebarTemplateValue.animate_state);
  // }
  //
  // get project() {
  //   return this._project;
  // }
  //
  // get scrollButton(): boolean {
  //   return this._scrollButton;
  // }
  //
  // get currentPage(): string {
  //   return this._currentPage;
  // }
  //
  // get imgType(): string {
  //   return this._imgType;
  // }
  //
  // get sidebarTemplateValue(): SidebarInterface {
  //   return this._sidebarTemplateValue;
  // }
  //
  // set sidebarTemplateValue(value: SidebarInterface) {
  //   this._sidebarTemplateValue = value;
  // }
  //
  // get sidebarState(): Subject<string> {
  //   return this._sidebarState;
  // }
  //
  // set sidebarState(value: Subject<string>) {
  //   this._sidebarState = value;
  // }

}

