import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators'
import { User } from '../../../../models/user.model';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../models/innovation';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})

export class CollaboratorComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this._innovationId = value._id;
    this._innovationCollaborators = value.collaborators;
  }

  @Input() set sidebarState(value: string) {
    if (value === 'active' || value === undefined) {
      this._formData.reset();
    }
  }

  @Output() collaboratorAdded = new EventEmitter<any>();

  private _innovationId: string;

  private _innovationCollaborators: Array<User> = [];

  private _formData: FormGroup;

  private _collaboratorsInvited: Array<string> = [];

  private _collaboratorsAddingProcess: any = {
    usersAdded: [],
    invitationsToSend: [],
    invitationsToSendAgain: []
  };

  constructor(private formBuilder: FormBuilder,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._formData = this.formBuilder.group({
      collaboratorEmail: ['', [Validators.required, Validators.email]]
    });
  }


  onSubmit(event: Event) {
    event.preventDefault();

    const email = this._formData.get('collaboratorEmail').value;

    this.innovationService.inviteCollaborators(this._innovationId, email).pipe(first()).subscribe((response: any) => {
        if (response.usersAdded.length || response.invitationsToSend.length || response.invitationsToSendAgain.length) {
          this._collaboratorsAddingProcess = response;
          this._collaboratorsAddingProcess.inviteUrl = this.innovationService.getInvitationUrl();

          if (response.invitationsToSend.length) {
            this._collaboratorsInvited.push(this._collaboratorsAddingProcess.invitationsToSend.toString());
            window.location.href = 'mailto:' + this._collaboratorsAddingProcess.invitationsToSend.join(',') + '?body=' + this._collaboratorsAddingProcess.inviteUrl;
          }

          if (response.invitationsToSendAgain.length) {

            if (this._collaboratorsInvited.length !== 0) {

              const index = this._collaboratorsInvited.indexOf(email.toString());

              if (index === -1) {
                this._collaboratorsInvited.push(this._collaboratorsAddingProcess.invitationsToSendAgain.toString());
              }

              window.location.href = 'mailto:' + this._collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this._collaboratorsAddingProcess.inviteUrl;

            } else {
              this._collaboratorsInvited.push(this._collaboratorsAddingProcess.invitationsToSendAgain.toString());
              window.location.href = 'mailto:' + this._collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this._collaboratorsAddingProcess.inviteUrl;
            }

          }

          if (response.usersAdded.length) {
            this._innovationCollaborators = this._innovationCollaborators.concat(response.usersAdded);
            this.collaboratorAdded.emit(this._innovationCollaborators);
            this.translateNotificationsService.success('PROJECT_MODULE.COLLABORATOR_ADDED.TITLE', 'PROJECT_MODULE.COLLABORATOR_ADDED.CONTENT');
          }

        } else {
          this.translateNotificationsService.success('PROJECT_MODULE.COLLABORATOR_ALREADY_ADDED.TITLE', 'PROJECT_MODULE.COLLABORATOR_ALREADY_ADDED.CONTENT');
        }

        this._formData.reset();

      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });

  }


  reinviteCollaborator(event: Event, email: string) {
    event.preventDefault();

    this.innovationService.inviteCollaborators(this._innovationId, email).pipe(first()).subscribe((response: any) => {
      window.location.href = 'mailto:' + response.invitationsToSendAgain.join(',') + '?body=' + this.innovationService.getInvitationUrl();
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  removeCollaborator(event: Event, email: any) {
    event.preventDefault();

    this.innovationService.removeCollaborator(this._innovationId, email).pipe(first()).subscribe((response: any) => {
      this._innovationCollaborators = response;
      this.collaboratorAdded.emit(this._innovationCollaborators);
      this.translateNotificationsService.success('PROJECT_MODULE.COLLABORATOR_DELETED.TITLE', 'PROJECT_MODULE.COLLABORATOR_DELETED.CONTENT');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  get innovationId(): string {
    return this._innovationId;
  }

  get innovationCollaborators(): Array<User> {
    return this._innovationCollaborators;
  }

  get formData(): FormGroup {
    return this._formData;
  }

  get collaboratorsInvited(): Array<string> {
    return this._collaboratorsInvited;
  }

  get collaboratorsAddingProcess(): any {
    return this._collaboratorsAddingProcess;
  }

}
