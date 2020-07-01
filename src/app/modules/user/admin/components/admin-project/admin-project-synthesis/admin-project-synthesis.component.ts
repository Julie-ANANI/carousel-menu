import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../../models/innovation';
import {AuthService} from "../../../../../../services/auth/auth.service";

@Component({
  selector: 'app-admin-project-synthesis',
  templateUrl: 'admin-project-synthesis.component.html',
  styleUrls: ['admin-project-synthesis.component.scss']
})
export class AdminProjectSynthesisComponent implements OnInit {

  private _project: Innovation;

  constructor(private _activatedRoute: ActivatedRoute,
              private _authService: AuthService ) {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
  }

  ngOnInit(): void {
  }

  public adminMode(): boolean {
    return this._authService.adminLevel > 2;
  }

  _updateProject(innovation: Innovation) {
    this._project = innovation;
  }

  get project() { return this._project; }
}
