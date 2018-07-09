import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { Innovation } from '../../../../models/innovation';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-admin-project',
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.scss']
})
export class AdminProjectComponent implements OnInit {

  private _project: Innovation;
  private _tabs: Array<string> = ['settings', 'cards', 'campaigns', 'synthesis', 'tags'];

  constructor(private _activatedRoute: ActivatedRoute,
              private _titleService: TranslateTitleService,
              private _authService: AuthService) {}

  ngOnInit(): void {
    this._titleService.setTitle('COMMON.MY_PROJECT');
    this._project = this._activatedRoute.snapshot.data['innovation'];
  }

  get authorizedTabs(): Array<string> {
    const adminLevel = this._authService.adminLevel;
    if(adminLevel > 1) {
      return this._tabs;
    } else {
      return ['cards', 'campaigns', 'synthesis'];
    }
  }

  public get project(): Innovation { return this._project; }
  public get tabs(): Array<string> { return this._tabs; }
  public get baseUrl(): string { return `/admin/projects/project/${this._project._id}/`; }
}
