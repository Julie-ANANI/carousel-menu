import { Component, Input } from '@angular/core';
import { TranslateNotificationsService } from "../../../../services/notifications/notifications.service";
import { InnovationService } from "../../../../services/innovation/innovation.service";
import { Innovation } from "../../../../models/innovation";
import { InnovationFrontService } from "../../../../services/innovation/innovation-front.service";
import { SidebarInterface } from '../../../sidebars/interfaces/sidebar-interface';

@Component({
  selector: 'shared-follow-up',
  templateUrl: './shared-follow-up.component.html',
  styleUrls: ['./shared-follow-up.component.scss']
})

export class SharedFollowUpComponent {

  @Input() set project(value: Innovation) {
    if (value) {
      this._project = value;
      this._initializeMailCustomFields();
    }
  }

  private _project: Innovation = <Innovation> {};

  private _customFields: { fr: Array<{label: string, value: string}>, en: Array<{label: string, value: string}>} = {
    en: [],
    fr: []
  };

  private _sidebarTemplate: SidebarInterface = {
    animate_state: 'inactive',
    type: 'follow-up'
  };

  private _modalTemplateType: string = '';

  private _showModal: boolean = false;

  constructor(private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  public saveTemplates() {
    this._innovationService.save(this._project._id, this._project).subscribe((response: Innovation) => {
      this._translateNotificationsService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SAVED_TEXT');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }

  private _initializeMailCustomFields() {
    this._customFields = {
      fr: [
        { value: '*|FIRSTNAME|*', label: 'Prénom du pro' },
        { value: '*|LASTNAME|*', label: 'Nom du pro' },
        { value: '*|TITLE|*', label: InnovationFrontService.currentLangInnovationCard(this._project, 'fr', 'title') || 'TITLE'},
        { value: '*|COMPANY_NAME|*', label: this._project.owner && this._project.owner.company ? this._project.owner.company : 'COMPANY_NAME' },
        { value: '*|CLIENT_NAME|*', label: this._project.owner ? this._project.owner.name : 'CLIENT_NAME' }
      ],
      en: [
        { value: '*|FIRSTNAME|*', label: 'First name' },
        { value: '*|LASTNAME|*', label: 'Last name' },
        { value: '*|TITLE|*', label: InnovationFrontService.currentLangInnovationCard(this._project, 'en', 'title') || 'TITLE'},
        { value: '*|COMPANY_NAME|*', label: this._project.owner && this._project.owner.company ? this._project.owner.company : 'COMPANY_NAME' },
        { value: '*|CLIENT_NAME|*', label: this._project.owner ? this._project.owner.name : 'CLIENT_NAME' }
      ]
    };
  }

  public onClickSee(event: Event, type: string) {
    event.preventDefault();
    this._modalTemplateType = type;
    this._showModal = true;
  }

  public onClickDone(event: Event) {
    event.preventDefault();
  }

  public updateCcEmail(email:string) {
    this._project.followUpEmails.ccEmail = email;
  }

  get email(): any {
    return this._modalTemplateType ? this._project.followUpEmails[this._modalTemplateType] : null;
  }

  get project(): Innovation {
    return this._project;
  }

  get customFields(): {fr: Array<{label: string, value: string}>, en: Array<{label: string, value: string}>} {
    return this._customFields;
  }

  get sidebarTemplate(): SidebarInterface {
    return this._sidebarTemplate;
  }

  set sidebarTemplate(value: SidebarInterface) {
    this._sidebarTemplate = value;
  }

  get modalTemplateType(): string {
    return this._modalTemplateType;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

}
