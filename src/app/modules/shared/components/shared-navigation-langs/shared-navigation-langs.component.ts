import { Component } from '@angular/core';
import {Innovation} from '../../../../models/innovation';
import {RouteFrontService} from '../../../../services/route/route-front.service';
import {InnovCard} from '../../../../models/innov-card';
import {InnovationFrontService} from '../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-shared-navigation-langs',
  templateUrl: './shared-navigation-langs.component.html',
  styleUrls: ['./shared-navigation-langs.component.scss']
})
export class SharedNavigationLangsComponent {

  private _activeTab = this._routeFrontService.activeTab(8, 7);
  private _project: Innovation = <Innovation>{};
  private _activeCardIndex = 0;

  private _username = 'JULIE';

  constructor(private _routeFrontService: RouteFrontService) { }

  get user() {
    return this._username;
  };

  get showLangDrop(): boolean {
    return this._project.innovationCards && this._project.innovationCards.length > 1;
  }

  get activeTab(): string {
    return this._activeTab;
  }

  get activeCard(): InnovCard {
    return InnovationFrontService.activeCard(this._project, this._activeCardIndex);
  }

}
