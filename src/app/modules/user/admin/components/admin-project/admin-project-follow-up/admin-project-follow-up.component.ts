import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Innovation } from "../../../../../../models/innovation";
import {InnovationService} from "../../../../../../services/innovation/innovation.service";
import {TranslateNotificationsService} from "../../../../../../services/notifications/notifications.service";
@Component({
  selector: 'app-admin-project-follow-up',
  templateUrl: 'admin-project-follow-up.component.html',
  styleUrls: ['admin-project-follow-up.component.scss']
})

export class AdminProjectFollowUpComponent implements OnInit {

  private _modal: string = '';
  private _project: Innovation;

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }

  public saveTemplates() {
    this._innovationService.save(this._project._id, this._project).subscribe((response: Innovation) => {
      this._translateNotificationsService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SUBMITTED_TEXT');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
  }

  get email(): any {
    return this._modal ? this._project.followUpEmails[this._modal] : null;
  }

  get modal(): string {
    return this._modal;
  }

  set modal(value: string) {
    this._modal = value;
  }

  get project(): Innovation {
    return this._project;
  }

}
