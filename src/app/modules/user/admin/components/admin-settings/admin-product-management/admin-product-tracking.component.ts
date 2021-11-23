import { Component, OnInit } from '@angular/core';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';

@Component({
  templateUrl: './admin-product-tracking.component.html',
})

export class AdminProductTrackingComponent implements OnInit {
  private _helpCommunity = ['skip', 'text', 'download', 'linkedin', 'video'];

  private _futureHelpCommunity = ['text', 'linkedin', 'video'];

  private _helpCommunityTabActivated = 'skip';

  private _futureHelpCommunityTabActivated = 'text';

  constructor(private _rolesFrontService: RolesFrontService) {
  }

  ngOnInit(): void {
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['settings'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'tracking']);
    }
  }

  activateTab(help: string) {
    this._helpCommunityTabActivated = help;
  }

  activateTabFuture(future: string) {
    this._futureHelpCommunityTabActivated = future;
  }

  get helpCommunity(): string[] {
    return this._helpCommunity;
  }

  get futureHelpCommunity(): string[] {
    return this._futureHelpCommunity;
  }


  get helpCommunityTabActivated(): string {
    return this._helpCommunityTabActivated;
  }

  get futureHelpCommunityTabActivated(): string {
    return this._futureHelpCommunityTabActivated;
  }
}
