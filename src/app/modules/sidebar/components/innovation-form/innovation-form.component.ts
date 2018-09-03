import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Innovation} from '../../../../models/innovation';
import {InnovationSettings} from '../../../../models/innov-settings';
import {TemplatesService} from '../../../../services/templates/templates.service';
import {EmailSignature} from '../../../../models/email-signature';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';
import {FrontendService} from '../../../../services/frontend/frontend.service';

@Component({
  selector: 'app-innovation-form',
  templateUrl: './innovation-form.component.html',
  styleUrls: ['./innovation-form.component.scss']
})
export class InnovationFormComponent implements OnInit {

  @Input() setProject: Subject<Innovation>;

  @Input() set initialProject(value: Innovation) {
    this._project = JSON.parse(JSON.stringify(value));
  }

  @Input() set type(type: string) {
    this._type = type;
    this.loadTypes();
  }

  @Input() sidebarState: Subject<string>;

  @Output() projectChange = new EventEmitter<Innovation>();

  @Output() sendMail = new EventEmitter<any>();

  isPitch = false;
  isTargeting = false;
  isStatus = false;
  isMail = false;
  isUserSatisfaction = false;
  isFeedback = false;

  private _type = '';

  private _project: Innovation = {};
  private _isChange = false;

  private _email = {};

  status = [
    {name: 'EDITING', alias: 'Editing'},
    {name: 'SUBMITTED', alias: 'Submitted'},
    {name: 'EVALUATING', alias: 'Evaluating'},
    {name: 'DONE', alias: 'Done'}];
  statusValid = true;
  private _signatures: Array<EmailSignature> = [];

  constructor(private _templatesService: TemplatesService,
              private _notificationsService: TranslateNotificationsService,
              private frontendService: FrontendService) { }

  ngOnInit() {

    this._email = {
      en: {language: 'en', subject: '', content: ''},
      fr: {language: 'fr', subject: '', content: ''}
    };

    this._isChange = false;
    this.statusValid = true;

    if (this.setProject) {
      this.setProject.subscribe((project) => {
        this._project = JSON.parse(JSON.stringify(project));
      })
    }

    if (this.sidebarState) {
      this.sidebarState.subscribe((state) => {
        if (state === 'inactive') {
          this._isChange = false;
          this._email = {
            en: {language: 'en', subject: '', content: ''},
            fr: {language: 'fr', subject: '', content: ''}
          };
          this.statusValid = true;
          console.log(this._project.clientSatisfaction);
        }
      });
    }

  }

  reinitialiseForm() {
    this.isPitch = false;
    this.isTargeting = false;
    this.isStatus = false;
    this.isMail = false;
    this.isUserSatisfaction = false;
    this.isFeedback = false;
  }

  loadTypes() {
    this.reinitialiseForm();

    switch (this.type) {
      case('pitch') : {
        this.isPitch = true;
        break;
      } case('targeting'): {
        this.isTargeting = true;
        break;
      } case('preview'): {
        break;
      } case('feedback'): {
        this.isFeedback = true;
        break;
      } case('satisfaction'): {
        if (!this._project.clientSatisfaction) {
          this._project.clientSatisfaction = {};
        }
        this.isUserSatisfaction = true;
        break;
      } case('send-ending-mail'): {
        this.isMail = true;
        this._templatesService.getAllSignatures({limit: 0, sort: {_id: -1}}).first().subscribe((signatures: any) => {
          this._signatures = signatures.result;
        });
        break;
      } case('status'): {
        this.isStatus = true;
        this._templatesService.getAllSignatures({limit: 0, sort: {_id: -1}}).first().subscribe((signatures: any) => {
          this._signatures = signatures.result;
        });
        break;
      } default: {
        break;
      }
    }

  }

  // TODO : Implement functionality to send mail
  onSubmit() {
    this._isChange = false;
    switch (this.type) {
      case('pitch') : {
        this.calculatePercentage();
        this.projectChange.emit(this._project);
        break;
      } case('targeting'): {
        this.calculatePercentage();
        this.projectChange.emit(this._project);
        break;
      } case('satisfaction'): {
        this.projectChange.emit(this._project);
        break;
      } case('status'): {
        this.projectChange.emit(this._project);
        if (this.sendMail !== {}) {
          this.sendMail.emit(this._email);
        }
        this.sendMail.emit(this._email);
        break;
      } case('feedback'): {
        this.projectChange.emit(this._project);
        break;
      } case('preview'): {
        break;
      } case('send-ending-mail'): {
        this._project._metadata.delivery.endingmail = true;
        this.projectChange.emit(this._project);
        if (this.sendMail !== {}) {
          this.sendMail.emit(this._email);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  projectEdit(value: Innovation) {
    this._project = value;
  }

  settingsEdit(value: InnovationSettings) {
    this._isChange = true;
    this.project.settings = value;
  }

  checkStatus(event: 'EDITING' | 'SUBMITTED' | 'EVALUATING' | 'DONE') {
    this.statusValid = true;
    switch (this._project.status) {
      case 'SUBMITTED': {
        if (event === 'EDITING') {
          this.statusValid = false;
        }
        break;
      } case 'EVALUATING' : {
        if (event === 'SUBMITTED' || event === 'EDITING') {
          this.statusValid = false;
        }
        break;
      } default : {
        break;
      }
    }

    if (this.statusValid === false) {
      this._notificationsService.error('PROJECT_LIST.STATUS' , 'Vous ne pouvez pas revenir à ce status');
    } else {
      this._isChange = true;
      this._project.status = event;
    }
  }

  calculatePercentage() {
    this.frontendService.completionCalculation(this.project);

    const percentages = this.frontendService.calculatedPercentages;

    if (percentages) {
      this.project.settings.completion = percentages.settingPercentage;
      this.project.completion = percentages.totalPercentage;
      percentages.innovationCardsPercentage.forEach((item: any) => {
        const index = this.project.innovationCards.findIndex(card => card.lang === item.lang);
        this.project.innovationCards[index].completion = item.percentage;
      });
    }
  }

  onSatisfactionChange(event: any) {
    this._project.clientSatisfaction.satisfaction = event.srcElement.value;
    this._project.clientSatisfaction.message = '';
    this._isChange = true;
  }

  onUserMessageChange(message: string) {
    this._project.clientSatisfaction.message = message;
    this._isChange = true;
  }

  onReviewChange(message: string) {
    this._project.feedback = message;
    this._isChange = true;
  }

  get type(): string {
    return this._type;
  }

  get project(): Innovation {
    return this._project;
  }

  get isChange(): boolean {
    return this._isChange;
  }

  set isChange(value: boolean) {
    this._isChange = value;
  }

  get email(): {} {
    return this._email;
  }

  set email(value: {}) {
    this._email = value;
    this.isChange = true;
  }

  get signatures(): Array<EmailSignature> {
    return this._signatures;
  }
}
