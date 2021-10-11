import {Component, OnDestroy, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {RouteFrontService} from '../../../../../../services/route/route-front.service';
import {TranslateTitleService} from '../../../../../../services/title/title.service';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import { NavigationFrontService } from "../../../../../../services/navigation/navigation-front.service";
import { Router } from "@angular/router";

interface Tab {
  route: string;
  name: string;
  key: string;
}

@Component({
  selector: 'app-admin-project-analysis',
  templateUrl: './admin-project-analysis.component.html',
  styleUrls: ['./admin-project-analysis.component.scss']
})

export class AdminProjectAnalysisComponent implements OnInit, OnDestroy {

  private _tabs: Array<Tab> = [
    {key: 'synthesis', name: 'Synthesis', route: 'synthesis'},
    {key: 'answerTags', name: 'Answer tags', route: 'answer-tags'},
    {key: 'storyboard', name: 'Storyboard', route: 'storyboard'},
  ];

  private _project: Innovation = <Innovation>{};

  private _activeTab = this._routeFrontService.activeTab(8, 7);

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _innovationFrontService: InnovationFrontService,
              private _routeFrontService: RouteFrontService,
              private _rolesFrontService: RolesFrontService,
              private _router: Router,
              private _navigationFrontService: NavigationFrontService,
              private _translateTitleService: TranslateTitleService) { }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._project = innovation || <Innovation>{};
      this._setPageTitle();
    });

    this._navigationFrontService.navigation().pipe(takeUntil(this._ngUnsubscribe)).subscribe(value => {
      if (value && value.item && value.tab.name === 'Analysis') {
        setTimeout(() => {
          this._setPageTitle(value.item.path);
          this._router.navigate([`/user/admin/projects/project/${this._project._id}/analysis/${value.item.path}`]);
        }, 0);
      }
    });
  }

  private _setPageTitle(tab?: string) {
    this._activeTab = tab ? tab : this._activeTab;
    this._translateTitleService.setTitle(`${this._activeTab.slice(0,1).toUpperCase()}${this._activeTab.slice(1)}
      | Analysis | ${this._project.name}`);
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project'];
    return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
  }

  public onClickTab(event: Event, tab: string) {
    event.preventDefault();
    this._setPageTitle(tab);
  }

  get tabs(): Array<Tab> {
    return this._tabs;
  }

  get project(): Innovation {
    return this._project;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
