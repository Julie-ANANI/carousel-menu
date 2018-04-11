import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { Innovation } from '../../../../models/innovation';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-project',
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.scss']
})
export class AdminProjectComponent implements OnInit {
  
  private _project: Innovation;
  private _tabs: Array<string> = ['settings', 'cards', 'campaigns', 'synthesis'];

  constructor(private _activatedRoute: ActivatedRoute,
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('MY_PROJECTS.TITLE');
    this._project = this._activatedRoute.snapshot.data['innovation'];
  }

  public get project(): Innovation { return this._project; }
  public get tabs(): Array<string> { return this._tabs; }
  public get baseUrl(): string { return `/admin/projects/project/${this._project._id}/`; }
}
