import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators'
import { User } from '../../../../models/user.model';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})

export class CollaboratorComponent implements OnInit {

  @Input() set projectId(value: string) {
    this._innovationId = value;
  }

  @Input() set collaborator(value: Array<User>) {
    this._innovationCollaborators = value;
  }

  @Input() set sidebarState(value: string) {
    if (value === 'inactive') {
      this._formData.reset();
    }
  }

  @Output() collaboratorAdded = new EventEmitter<any>();

  private _innovationId: string;

  private _innovationCollaborators: Array<User> = [];

  private _formData: FormGroup;

  private _collaboratorsInvited: Array<string> = [];

  collaboratorsAddingProcess: any = {
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

    this.innovationService.inviteCollaborators(this._innovationId, email).pipe(first())
      .subscribe((response: any) => {
        if (response.usersAdded.length || response.invitationsToSend.length || response.invitationsToSendAgain.length) {
          this.collaboratorsAddingProcess = response;
          this.collaboratorsAddingProcess.inviteUrl = this.innovationService.getInvitationUrl();

          if (response.invitationsToSend.length) {
            this._collaboratorsInvited.push(this.collaboratorsAddingProcess.invitationsToSend.toString());
            window.location.href = 'mailto:' + this.collaboratorsAddingProcess.invitationsToSend.join(',') + '?body=' + this.collaboratorsAddingProcess.inviteUrl;
          }

          if (response.invitationsToSendAgain.length) {

            if (this._collaboratorsInvited.length !== 0) {

              const index = this._collaboratorsInvited.indexOf(email.toString());

              if (index === -1) {
                this._collaboratorsInvited.push(this.collaboratorsAddingProcess.invitationsToSendAgain.toString());
              }

              window.location.href = 'mailto:' + this.collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this.collaboratorsAddingProcess.inviteUrl;

            } else {
              this._collaboratorsInvited.push(this.collaboratorsAddingProcess.invitationsToSendAgain.toString());
              window.location.href = 'mailto:' + this.collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this.collaboratorsAddingProcess.inviteUrl;
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

      });

  }


  reinviteCollaborator(event: Event, email: string) {
    event.preventDefault();

    this.innovationService.inviteCollaborators(this._innovationId, email).pipe(first()).subscribe((response: any) => {
      window.location.href = 'mailto:' + response.invitationsToSendAgain.join(',') + '?body=' + this.innovationService.getInvitationUrl();
    });

  }


  removeCollaborator(event: Event, email: any) {
    event.preventDefault();

    this.innovationService.removeCollaborator(this._innovationId, email).subscribe((response: any) => {
      this._innovationCollaborators = response;
      this.translateNotificationsService.success('PROJECT_MODULE.COLLABORATOR_DELETED.TITLE', 'PROJECT_MODULE.COLLABORATOR_DELETED.CONTENT');
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

}
