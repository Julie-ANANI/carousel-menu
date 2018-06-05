import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../models/innovation';
import { emailRegEx } from '../../../../utils/regex';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';

const DEFAULT_PAGE = 'setup';

@Component({
  selector: 'app-client-project',
  templateUrl: './client-project.component.html',
  styleUrls: ['./client-project.component.scss']
})

export class ClientProjectComponent implements OnInit {

  @Input() project: Innovation;

  private _imgType: string;
  private _currentPage: string;
  /*
   * Ajout de collaborateurs
   */
  public displayAddCollaboratorsModal = false;
  showCollaboratorRequiredError = false;
  showCollaboratorInvalidError = false;
  public collaborators_emails = '';
  collaboratorsInvited: Array<string> = [];
  public collaboratorsAddingProcess: any = {
    usersAdded: [],
    invitationsToSend: [],
    invitationsToSendAgain: []
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _router: Router,
              private _translateNotificationService: TranslateNotificationsService) {
    // override the route reuse strategy
    this._router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

  }

  ngOnInit() {
    const url = this._router.routerState.snapshot.url.split('/');

    this._currentPage = url ? url[3] || DEFAULT_PAGE : DEFAULT_PAGE;

    if (!this.project) {
      this.project = this._activatedRoute.snapshot.data['innovation'];
    }

    // Getting the project type
    if (this.project.type === 'leads') {
      this._imgType = 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-leads.svg';
    } else if (this.project.type === 'apps') {
      this._imgType = 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-apps.svg';
    } else {
      this._imgType = 'https://res.cloudinary.com/umi/image/upload/v1526375000/app/default-images/get-insights.svg';
    }

  }

  /*public validCollaboratorsList(): boolean {
    let validCount = 0;

    const split = this.collaborators_emails.split(/[\s,;:]/g).filter(val => val !== '');

    split.forEach(mail => {
      if (mail.match(emailRegEx)) {
        validCount++;
      }
    });

    return validCount > 0 && validCount === split.length;

  }*/

  public removeCollaborator(event: Event, value: any) {
    event.preventDefault();

    this._innovationService.removeCollaborator(this.project._id, value).subscribe((data) => {
      this.project.collaborators = data;
      this._translateNotificationService.success('PROJECT_MODULE.COLLABORATOR_DELETED.TITLE', 'PROJECT_MODULE.COLLABORATOR_DELETED.CONTENT');
    });

  }

  public addCollaborators (event: Event): void {
    event.preventDefault();

    if (this.collaborators_emails === '') {
      this.showCollaboratorRequiredError = true;
      this.showCollaboratorInvalidError = false;
    } else {

      if (this.collaborators_emails.match(emailRegEx)) {
        this.showCollaboratorRequiredError = false;
        this.showCollaboratorInvalidError = false;

        this._innovationService.inviteCollaborators(this.project._id, this.collaborators_emails).first()
          .subscribe((data: any) => {

            if (data.usersAdded.length || data.invitationsToSend.length || data.invitationsToSendAgain.length) {
              this.collaboratorsAddingProcess = data;
              this.collaboratorsAddingProcess.inviteUrl = this._innovationService.getInvitationUrl();

              if (data.invitationsToSend.length) {
                this.collaboratorsInvited.push(this.collaboratorsAddingProcess.invitationsToSend.toString());
                window.location.href = 'mailto:' + this.collaboratorsAddingProcess.invitationsToSend.join(',') + '?body=' + this.collaboratorsAddingProcess.inviteUrl;
              }

              if (data.invitationsToSendAgain.length) {

                if (this.collaboratorsInvited.length !== 0) {

                  const index = this.collaboratorsInvited.indexOf(this.collaborators_emails.toString());

                  if (index === -1) {
                    this.collaboratorsInvited.push(this.collaboratorsAddingProcess.invitationsToSendAgain.toString());
                  }

                  window.location.href = 'mailto:' + this.collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this.collaboratorsAddingProcess.inviteUrl;

                } else {
                  this.collaboratorsInvited.push(this.collaboratorsAddingProcess.invitationsToSendAgain.toString());
                  window.location.href = 'mailto:' + this.collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this.collaboratorsAddingProcess.inviteUrl;
                }

              }

              if (data.usersAdded.length) {
                this.project.collaborators = this.project.collaborators.concat(data.usersAdded);
                this._translateNotificationService.success('PROJECT_MODULE.COLLABORATOR_ADDED.TITLE', 'PROJECT_MODULE.COLLABORATOR_ADDED.CONTENT');
              }

            } else {
              this._translateNotificationService.success('PROJECT_MODULE.COLLABORATOR_ALREADY_ADDED.TITLE', 'PROJECT_MODULE.COLLABORATOR_ALREADY_ADDED.CONTENT');
            }
            this.collaborators_emails = '';
          });
      } else {
        this.showCollaboratorRequiredError = false;
        this.showCollaboratorInvalidError = true;
      }

    }

  }

  public reinviteCollaborator(event: Event, email: string) {
    event.preventDefault();

    this._innovationService.inviteCollaborators(this.project._id, email).first().subscribe((data) => {
      window.location.href = 'mailto:' + data.invitationsToSendAgain.join(',') + '?body=' + this._innovationService.getInvitationUrl();
    });

  }

  get currentPage(): string {
    return this._currentPage;
  }

  get imgType(): string {
    return this._imgType;
  }

}

/*
this.collaboratorsInvited.forEach((items) => {
                    if (items.includes(this.collaborators_emails.toString())) {
                      window.location.href = 'mailto:' + this.collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this.collaboratorsAddingProcess.inviteUrl;
                    } else {
                      window.location.href = 'mailto:' + this.collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this.collaboratorsAddingProcess.inviteUrl;
                      this.collaboratorsInvited.push(this.collaboratorsAddingProcess.invitationsToSendAgain.toString());
                    }
                  });
      if (this.collaborators_emails === '') {
     this.showCollaboratorRequiredError = true;
     this.showCollaboratorsInvalidError = false;
   } else {
     if (this.validCollaboratorsList()) {
       this.innovationService.inviteCollaborators(this.project._id, this.collaborators_emails).first()
         .subscribe((data: any) => {
           if (data.usersAdded.length || data.invitationsToSend.length || data.invitationsToSendAgain.length) {
             this.collaboratorsAddingProcess = data;
             this.collaboratorsAddingProcess.inviteUrl = this.innovationService.getInvitationUrl();

             if (data.usersAdded.length) {
               this.project.collaborators = this.project.collaborators.concat(data.usersAdded);
             }

             console.log(data);

           }
           this.collaborators_emails = '';
           this.displayAddCollaboratorsModal = false;
         });
     } else {
       this.showCollaboratorRequiredError = false;
       this.showCollaboratorsInvalidError = true;
     }
   }
  if (this.collaborators_emails !== '') {
     this.innovationService.inviteCollaborators(this.project._id, this.collaborators_emails).first()
       .subscribe((data: any) => {
       if (data.usersAdded.length || data.invitationsToSend.length || data.invitationsToSendAgain.length) {
         this.collaboratorsAddingProcess = data;
         this.collaboratorsAddingProcess.inviteUrl = this.innovationService.getInvitationUrl();
         this.displayCollaboratorsAddingProcess = true;

         if (data.usersAdded.length) {
           this.project.collaborators = this.project.collaborators.concat(data.usersAdded);
         }

       }
       this.collaborators_emails = '';
       this.displayAddCollaboratorsModal = false;
     });
   }*/
