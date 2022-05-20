import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {Innovation} from '../../../../models/innovation';
import {InnovationSettings} from '../../../../models/innov-settings';
import {TemplatesService} from '../../../../services/templates/templates.service';
import {EmailSignature} from '../../../../models/email-signature';
import {TranslateNotificationsService} from '../../../../services/translate-notifications/translate-notifications.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import {takeUntil} from 'rxjs/operators';
import {InnovationFrontService} from '../../../../services/innovation/innovation-front.service';
import { ErrorFrontService } from "../../../../services/error/error-front.service";
import { HttpErrorResponse } from "@angular/common/http";
import {EmailObject} from '../../../../models/email';

@Component({
  selector: 'app-innovation-form',
  templateUrl: './innovation-form.component.html',
  styleUrls: ['./innovation-form.component.scss']
})
export class InnovationFormComponent implements OnInit, OnDestroy {

  @Input() isEditableDescription = false;

  @Input() isEditableTargeting = false;

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

  @Output() ownerLanguageChange = new EventEmitter<string>();

  isPitch = false;
  isTargeting = false;
  isStatus = false;
  isMail = false;
  isUserSatisfaction = false;
  isFeedback = false;

  private _type = '';

  private _project: Innovation = <Innovation>{};
  private _isChange = false;

  private _email: EmailObject = <EmailObject>{};

  status = [
    {name: 'EDITING', alias: 'Editing'},
    {name: 'SUBMITTED', alias: 'Submitted'},
    {name: 'EVALUATING', alias: 'Evaluating'},
    {name: 'DONE', alias: 'Done'}];
  statusValid = true;
  private _signatures: Array<EmailSignature> = [];

  private _saveCardComment: boolean = false;

  private _selectedCardIndex: number = 0;

  private _ngUnsubscribe: Subject<boolean> = new Subject();

  constructor(private _templatesService: TemplatesService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService,
              private _innovationFrontService: InnovationFrontService) {

    this._innovationFrontService.getSelectedInnovationIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response: number) => {

      if (response && this._saveCardComment) {
        this._saveComment();
      }

      this._selectedCardIndex = response;
    });

    this._innovationFrontService.getCardCommentNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response: boolean) => {
      this._saveCardComment = response;
    });

  }

  ngOnInit() {

    this._email = {
      en: {language: 'en', subject: '', content: ''},
      fr: {language: 'fr', subject: '', content: ''}
    };

    this._isChange = false;
    this.statusValid = true;

    if (this.setProject) {
      this.setProject.subscribe((project: Innovation) => {
        this._project = JSON.parse(JSON.stringify(project));
      })
    }

    if (this.sidebarState) {
      this.sidebarState.subscribe((state: any) => {
        if (state === 'inactive') {
          this._isChange = false;
          this._email = {
            en: {language: 'en', subject: '', content: ''},
            fr: {language: 'fr', subject: '', content: ''}
          };
          this.statusValid = true;
        }
      });
    }

  }

  updateOwnerLanguage(value: string) {
    this.ownerLanguageChange.emit(value);
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

    switch (this._type) {
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
        this._templatesService.getAllSignatures({limit: '0', sort: '{"id":-1}'}).subscribe((signatures: any) => {
          this._signatures = signatures.result;
        });
        break;
      } case('status'): {
        this.isStatus = true;
        this._templatesService.getAllSignatures({limit: '0', sort: '{"id":-1}'}).subscribe((signatures: any) => {
          this._signatures = signatures.result;
        });
        break;
      }
    }

  }

  private _saveComment() {
    if (this._saveCardComment) {
      this._saveCardComment = false;
      this._innovationService.saveInnovationCardComment(this._project._id, this._project.innovationCards[this._selectedCardIndex]._id,
        this._project.innovationCards[this._selectedCardIndex].operatorComment).subscribe(() => { }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error))
      });
    }
  }

  // TODO : Implement functionality to send mail
  onSubmit() {
    this._isChange = false;
    if ((this.isEditableDescription && this.type === 'pitch') || (this.isEditableTargeting && this.type === 'targeting')) {
      if (this._saveCardComment) {
        this._saveComment();
      }
    }
    this.projectChange.emit(this._project);
  }

  projectEdit(value: Innovation) {
    this._project = value;
    this._isChange = true;
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
      this._translateNotificationsService.error('COMMON.STATUS' , 'Vous ne pouvez pas revenir à ce status');
    } else {
      this._isChange = true;
      this._project.status = event;
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

  get email(): EmailObject {
    return this._email;
  }

  set email(value: EmailObject) {
    this._email = value;
    this.isChange = true;
  }

  get signatures(): Array<EmailSignature> {
    return this._signatures;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
