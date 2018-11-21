import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { Innovation } from '../../../../models/innovation';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { FrontendService } from '../../../../services/frontend/frontend.service';

@Component({
  selector: 'app-admin-project',
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.scss']
})

export class AdminProjectComponent implements OnInit {

  private _project: Innovation;
  private _tabs: Array<string> = ['settings', 'cards', 'answer_tags', 'questionnaire', 'campaigns', 'synthesis' ];
  clientSideUrl: string;

  constructor(private _activatedRoute: ActivatedRoute,
              private _titleService: TranslateTitleService,
              private _authService: AuthService,
              private _frontendService: FrontendService) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.data['innovation'];
    this._titleService.setTitle(this._project.name || 'Project');
    this.clientSideUrl = 'project/' + this.project._id;
    this._frontendService.calculateInnovationMetadataPercentages(this._project, 'preparation');
    this._frontendService.calculateInnovationMetadataPercentages(this._project, 'campaign');
    this._frontendService.calculateInnovationMetadataPercentages(this._project, 'delivery');
  }

  get authorizedTabs(): Array<string> {
    const adminLevel = this._authService.adminLevel;
    if (adminLevel > 1) {
      return this._tabs;
    } else {
      return ['cards', 'campaigns', 'synthesis'];
    }
  }

  getPercentage(level: string) {
    return this._frontendService.innovationMetadataCalculatedValues[level];
  }

  getColor(length: number) {
    if (length < 34 && length >= 0) {
      return '#EA5858';
    } else if (length >= 34 && length < 67) {
      return '#f0ad4e';
    } else {
      return '#2ECC71';
    }
  }

  public get project(): Innovation { return this._project; }
  public get tabs(): Array<string> { return this._tabs; }
  public get baseUrl(): string { return `/admin/projects/project/${this._project._id}/`; }
}
