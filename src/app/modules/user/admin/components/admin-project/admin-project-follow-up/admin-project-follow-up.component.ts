import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../../models/innovation';
import { TranslateTitleService } from "../../../../../../services/title/title.service";
import { RolesFrontService } from "../../../../../../services/roles/roles-front.service";

@Component({
  templateUrl: 'admin-project-follow-up.component.html',
  styleUrls: ['admin-project-follow-up.component.scss']
})

export class AdminProjectFollowUpComponent implements OnInit {

  private _innovation: Innovation = <Innovation>{};

  constructor(private _activatedRoute: ActivatedRoute,
              private _rolesFrontService: RolesFrontService,
              private _translateTitleService: TranslateTitleService) {

    this._setPageTitle();
  }

  ngOnInit(): void {
    if (this._activatedRoute.snapshot.parent.data['innovation']
      && typeof this._activatedRoute.snapshot.parent.data['innovation'] !== undefined) {
      this._innovation = this._activatedRoute.snapshot.parent.data['innovation'];
      this._setPageTitle(this._innovation.name);
    }
  }

  private _setPageTitle(title?: string) {
    if (title) {
      this._translateTitleService.setTitle('Follow Up | ' + title);
    } else {
      this._translateTitleService.setTitle('Follow Up');
    }
  }

  _updateProject(innovation: Innovation) {
    this._innovation = innovation;
  }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'followUp']);
  }

  get innovation(): Innovation {
    return this._innovation;
  }

}
