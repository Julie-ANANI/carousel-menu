import { Component, OnInit } from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { SidebarInterface } from '../../../../sidebar/interfaces/sidebar-interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit {

  private _innovation: Innovation = {};

  private _offerTypeImage = '';

  private _sidebarValue: SidebarInterface = {};

  private _currentPage: string;

  constructor(private activatedRoute: ActivatedRoute,
              private translateTitleService: TranslateTitleService,
              private router: Router,
              private translateService: TranslateService) { }

  ngOnInit() {

    this.activatedRoute.data.subscribe((response) => {
      if (response && response['innovation']) {
        this._innovation = response['innovation'];
      }
    });

    const url = this.router.routerState.snapshot.url.split('/');

    if (url.length > 4) {
      const questionMark = url[4].indexOf('?');
      this._currentPage = questionMark > 0 ? url[4].slice(0, questionMark) : url[4];
    } else {
      this._currentPage = 'setup';
    }


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
    this._innovation.collaborators = event;
  }


  setCurrentTab(event: Event, value: string) {
    event.preventDefault();
    this._currentPage = value;
  }

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get innovation(): Innovation {
    return this._innovation;
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

}

