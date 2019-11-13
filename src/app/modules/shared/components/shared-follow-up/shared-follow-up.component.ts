import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { TranslateNotificationsService } from "../../../../services/notifications/notifications.service";
import { InnovationService } from "../../../../services/innovation/innovation.service";
import { Innovation } from "../../../../models/innovation";
import {InnovationFrontService} from "../../../../services/innovation/innovation-front.service";

@Component({
  selector: 'shared-follow-up',
  templateUrl: './shared-follow-up.component.html',
  styleUrls: ['./shared-follow-up.component.scss']
})

export class SharedFollowUpComponent implements OnInit {

  private _customFields: {fr: Array<{label: string, value: string}>, en: Array<{label: string, value: string}>} = {en: [], fr: []};

  private _modal: string = '';

  private _project: Innovation ;

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }

  public saveTemplates() {
    this._innovationService.save(this._project._id, this._project).subscribe((response: Innovation) => {
      this._translateNotificationsService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SAVED_TEXT');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }

  public updateCcEmail(email:string) {
    this._project.followUpEmails.ccEmail = email;
  }

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
    this._customFields = {
      fr: [
        { value: '*|FIRSTNAME|*', label: 'Prénom du pro'},
        { value: '*|LASTNAME|*', label: 'Nom du pro'},
        { value: '*|TITLE|*', label: InnovationFrontService.currentLangInnovationCard(this._project, 'fr', 'title') || 'TITLE'},
        { value: '*|COMPANY_NAME|*', label: this._project.owner.company || 'COMPANY_NAME'},
        { value: '*|CLIENT_NAME|*', label: `${this._project.owner.firstName} ${this._project.owner.lastName}` || 'CLIENT_NAME'}
      ],
      en: [
        { value: '*|FIRSTNAME|*', label: 'Prénom du pro'},
        { value: '*|LASTNAME|*', label: 'Nom du pro'},
        { value: '*|TITLE|*', label: InnovationFrontService.currentLangInnovationCard(this._project, 'en', 'title')},
        { value: '*|COMPANY_NAME|*', label: this._project.owner.company},
        { value: '*|CLIENT_NAME|*', label: `${this._project.owner.firstName} ${this._project.owner.lastName}`}
      ]
    };
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

  get customFields(): {fr: Array<{label: string, value: string}>, en: Array<{label: string, value: string}>} {
    return this._customFields;
  }

}
