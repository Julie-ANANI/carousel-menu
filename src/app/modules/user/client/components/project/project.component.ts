import { Component, OnDestroy, OnInit } from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { SidebarInterface } from '../../../../sidebar/interfaces/sidebar-interface';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { Subject } from 'rxjs';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit, OnDestroy {

  private _innovation: Innovation;

  private _sidebarValue: SidebarInterface = {};

  private _currentPage: string;

  private _saveChanges = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private activatedRoute: ActivatedRoute,
              private translateTitleService: TranslateTitleService,
              private router: Router,
              private translateService: TranslateService,
              private innovationFrontService: InnovationFrontService,
              private translateNotificationsService: TranslateNotificationsService) {

    this._innovation = this.activatedRoute.snapshot.data.innovation;

    this.translateTitleService.setTitle(this._innovation && this._innovation.name ? this._innovation.name : 'Project');

    this.innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._saveChanges = !!response;
    });

  }

  ngOnInit() {
    this.getPage();
  }


  private getPage() {
    const url = this.router.routerState.snapshot.url.split('/');
    if (url.length > 4) {
      const params = url[4].indexOf('?');
      this._currentPage = params > 0 ? url[4].substring(0, params) : url[4];
    } else {
      this._currentPage = 'setup';
    }
  }


  editCollaborator(event: Event) {
    event.preventDefault();

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.COLLABORATOR'
    };

  }


  addCollaborators (event: any): void {
    this._innovation.collaborators = event;
  }


  /***
   * this function will activate the tab and user has to save all the changes
   * before going to another page.
   * @param event
   * @param value
   */
  setCurrentTab(event: Event, value: string) {
    event.preventDefault();

    if (!this._saveChanges) {
      this._currentPage = value;
      this.router.navigate([value], {relativeTo: this.activatedRoute});
    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
    }

  }

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get currentPage(): string {
    return this._currentPage;
  }

  get saveChanges(): boolean {
    return this._saveChanges;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

