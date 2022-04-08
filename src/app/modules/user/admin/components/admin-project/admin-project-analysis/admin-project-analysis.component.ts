import { Component, OnInit } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { RouteFrontService } from '../../../../../../services/route/route-front.service';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';

interface Tab {
  route: string;
  name: string;
  key: string;
}

@Component({
  selector: 'app-admin-project-analysis',
  templateUrl: './admin-project-analysis.component.html',
})

export class AdminProjectAnalysisComponent implements OnInit {

  private _tabs: Array<Tab> = [
    {key: 'synthesis', name: 'Synthesis', route: 'synthesis'},
    {key: 'answerTags', name: 'Answer tags', route: 'answer-tags'},
    {key: 'storyboard', name: 'Storyboard', route: 'storyboard'},
  ];

  private _project: Innovation = <Innovation>{};

  private _activeTab = this._routeFrontService.activeTab(8, 7);

  constructor(private _innovationFrontService: InnovationFrontService,
              private _routeFrontService: RouteFrontService,
              private _rolesFrontService: RolesFrontService,
              private _translateTitleService: TranslateTitleService) {
  }

  ngOnInit() {
    this._project = this._innovationFrontService.innovation().value;
    this._setPageTitle();
  }

  private _setPageTitle(tab?: string) {
    this._activeTab = tab ? tab : this._activeTab;
    this._translateTitleService.setTitle(`${this._activeTab.slice(0, 1).toUpperCase()}${this._activeTab.slice(1)}
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

}
