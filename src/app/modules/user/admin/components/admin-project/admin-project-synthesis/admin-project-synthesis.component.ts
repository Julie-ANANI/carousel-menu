import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../../models/innovation';
import { RolesFrontService } from "../../../../../../services/roles/roles-front.service";

@Component({
  templateUrl: 'admin-project-synthesis.component.html',
  styleUrls: ['admin-project-synthesis.component.scss']
})

export class AdminProjectSynthesisComponent implements OnInit {

  private _innovation: Innovation = <Innovation>{};

  private _accessPath: Array<string> = ['projects', 'project', 'synthesis'];

  constructor(private _activatedRoute: ActivatedRoute,
              private _rolesFrontService: RolesFrontService) { }

  ngOnInit(): void {
    if (this._activatedRoute.snapshot.parent.data['innovation']
      && typeof this._activatedRoute.snapshot.parent.data['innovation'] !== undefined) {
      this._innovation = this._activatedRoute.snapshot.parent.data['innovation'];
    }
  }

  _updateProject(innovation: Innovation) {
    this._innovation = innovation;
  }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

}
