import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../models/innovation';
import { Tag } from '../../../../../models/tag';

@Component({
  selector: 'app-admin-project-tags-pool',
  templateUrl: 'admin-project-tags-pool.component.html',
  styleUrls: ['admin-project-tags-pool.component.scss']
})
export class AdminProjectTagsPoolComponent implements OnInit {

  private _project: Innovation;

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _notificationsService: TranslateNotificationsService,
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('MY_PROJECTS.TITLE');
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
  }

  public addTag(event: Tag): void {
    this._innovationService
      .addTag(this._project._id, event._id)
      .first()
      .subscribe((p) => {
        this._project = p;
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', err);
      });
  }

  public removeTag(event: Tag): void {
    this._innovationService
      .removeTag(this._project._id, event._id)
      .first()
      .subscribe((p) => {
        this._project = p;
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.REMOVED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', err);
      });
  }


  get project() { return this._project; }
}
