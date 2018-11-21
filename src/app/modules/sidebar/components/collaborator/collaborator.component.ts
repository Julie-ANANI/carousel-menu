import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators'
import {User} from '../../../../models/user.model';
import {InnovationService} from '../../../../services/innovation/innovation.service';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})

export class CollaboratorComponent implements OnInit {

  @Input() projectId: string;
  @Input() collaborator: Array<User>;
  @Input() sidebarState: Subject<string>;

  @Output() collaboratorAdded = new EventEmitter<any>();

  formData: FormGroup;
  collaboratorsInvited: Array<string> = [];
  collaboratorsAddingProcess: any = {
    usersAdded: [],
    invitationsToSend: [],
    invitationsToSendAgain: []
  };

  constructor(private formBuilder: FormBuilder,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService) {
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      collaboratorEmail: ['', [Validators.required, Validators.email]]
    });

    this.sidebarState.subscribe((state: any) => {
      if (state) {
        setTimeout (() => {
          this.formData.reset();
        }, 700);
      }
    });

  }


  onSubmit(event: Event) {
    event.preventDefault();

    const email = this.formData.get('collaboratorEmail').value;

    this.innovationService.inviteCollaborators(this.projectId, email)
      .pipe(first())
      .subscribe((response: any) => {
        if (response.usersAdded.length || response.invitationsToSend.length || response.invitationsToSendAgain.length) {
          this.collaboratorsAddingProcess = response;
          this.collaboratorsAddingProcess.inviteUrl = this.innovationService.getInvitationUrl();

          if (response.invitationsToSend.length) {
            this.collaboratorsInvited.push(this.collaboratorsAddingProcess.invitationsToSend.toString());
            window.location.href = 'mailto:' + this.collaboratorsAddingProcess.invitationsToSend.join(',') + '?body=' + this.collaboratorsAddingProcess.inviteUrl;
          }

          if (response.invitationsToSendAgain.length) {

            if (this.collaboratorsInvited.length !== 0) {

              const index = this.collaboratorsInvited.indexOf(email.toString());

              if (index === -1) {
                this.collaboratorsInvited.push(this.collaboratorsAddingProcess.invitationsToSendAgain.toString());
              }

              window.location.href = 'mailto:' + this.collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this.collaboratorsAddingProcess.inviteUrl;

            } else {
              this.collaboratorsInvited.push(this.collaboratorsAddingProcess.invitationsToSendAgain.toString());
              window.location.href = 'mailto:' + this.collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this.collaboratorsAddingProcess.inviteUrl;
            }

          }

          if (response.usersAdded.length) {
            this.collaborator = this.collaborator.concat(response.usersAdded);
            this.collaboratorAdded.emit(this.collaborator);
            this.translateNotificationsService.success('PROJECT_MODULE.COLLABORATOR_ADDED.TITLE', 'PROJECT_MODULE.COLLABORATOR_ADDED.CONTENT');
          }

        } else {
          this.translateNotificationsService.success('PROJECT_MODULE.COLLABORATOR_ALREADY_ADDED.TITLE', 'PROJECT_MODULE.COLLABORATOR_ALREADY_ADDED.CONTENT');
        }

        this.formData.reset();

      });

  }

  reinviteCollaborator(event: Event, email: string) {
    event.preventDefault();

    this.innovationService.inviteCollaborators(this.projectId, email).pipe(first()).subscribe((response: any) => {
      window.location.href = 'mailto:' + response.invitationsToSendAgain.join(',') + '?body=' + this.innovationService.getInvitationUrl();
    });

  }

  removeCollaborator(event: Event, email: any) {
    event.preventDefault();

    this.innovationService.removeCollaborator(this.projectId, email).subscribe((response: any) => {
      this.collaborator = response;
      this.translateNotificationsService.success('PROJECT_MODULE.COLLABORATOR_DELETED.TITLE', 'PROJECT_MODULE.COLLABORATOR_DELETED.CONTENT');
    });

  }

}
