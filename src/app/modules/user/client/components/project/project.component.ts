import {Component, OnDestroy, OnInit} from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SidebarInterface } from '../../../../sidebar/interfaces/sidebar-interface';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = {};

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _offerTypeImage = '';

  private _sidebarValue: SidebarInterface = {};

  private _currentPage:string;

  constructor(private activatedRoute: ActivatedRoute,
              private translateTitleService: TranslateTitleService,
              private router: Router) {

    this.activatedRoute.data.pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      if (response) {
        this._innovation = response.innovation;
      }
    });

    const url = this.router.routerState.snapshot.url.split('/');
    this._currentPage = url.length > 0 ? url[4] : 'setup';

  }

  ngOnInit() {
    this.translateTitleService.setTitle(this._innovation.name || 'Project');
    this.loadOfferType();
  }


  private loadOfferType() {
    switch (this._innovation.type) {

      case 'insights':
        this._offerTypeImage = 'https://res.cloudinary.com/umi/image/upload/v1539158153/app/default-images/offers/get-insights.svg';
        break;

      case 'apps':
        this._offerTypeImage = 'https://res.cloudinary.com/umi/image/upload/v1539157942/app/default-images/offers/get-apps.svg';
        break;

      case 'leads':
        this._offerTypeImage = 'https://res.cloudinary.com/umi/image/upload/v1539157943/app/default-images/offers/get-leads.svg';
        break;

      default:
        // do nothing.
    }
  }


  editCollaborator(event: Event) {
    event.preventDefault();

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'PROJECT_MODULE.ADD_COLLABORATORS_MODAL.TITLE'
    };

  }


  closeSidebar(value: SidebarInterface) {
    this._sidebarValue.animate_state = value.animate_state;
  }


  addCollaborators (event: any): void {
    this._innovation.collaborators = this._innovation.collaborators.concat(event);
  }


  setCurrentTab(event: Event, value: string) {
    event.preventDefault();
    this._currentPage = value;
  }


  get innovation(): Innovation {
    return this._innovation;
  }

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  get offerTypeImage(): string {
    return this._offerTypeImage;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  get currentPage(): string {
    return this._currentPage;
  }


  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

