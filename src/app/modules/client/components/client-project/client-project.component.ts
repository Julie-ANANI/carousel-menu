import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../models/innovation';
import { emailRegEx } from '../../../../utils/regex';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Collaborator } from '../../../shared/components/shared-sidebar/interfaces/collaborator';

const DEFAULT_PAGE = 'setup';

@Component({
  selector: 'app-client-project',
  templateUrl: './client-project.component.html',
  styleUrls: ['./client-project.component.scss']
})

export class ClientProjectComponent implements OnInit {

  @Input() project: Innovation;

  sidebarAnimateState: string;
  collaboratorValues: Collaborator = {};

  private _imgType: string;
  private _currentPage: string;
  private _scrollButton = false;
  /*
   * Ajout de collaborateurs
   */
  private _displayAddCollaboratorsModal = false;
  private _showCollaboratorRequiredError = false;
  private _showCollaboratorInvalidError = false;
  public collaborators_emails = '';
  private _collaboratorsInvited: Array<string> = [];
  private _collaboratorsAddingProcess: any = {
    usersAdded: [],
    invitationsToSend: [],
    invitationsToSendAgain: []
  };

  constructor(private activatedRoute: ActivatedRoute,
              private innovationService: InnovationService,
              private router: Router,
              private translateNotificationsService: TranslateNotificationsService) {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

  }

  ngOnInit() {
    const url = this.router.routerState.snapshot.url.split('/');

    this._currentPage = url ? url[3] || DEFAULT_PAGE : DEFAULT_PAGE;

    if (!this.project) {
      this.project = this.activatedRoute.snapshot.data['innovation'];
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

  enterKeyPress(event: Event) {
    if (event['keyCode'] === 13) {
      this.addCollaborators(event);
    }
  }

  addCollaborators (event: Event): void {
    event.preventDefault();

    if (this.collaborators_emails === '') {
      this._showCollaboratorRequiredError = true;
      this._showCollaboratorInvalidError = false;
    } else {

      if (this.collaborators_emails.match(emailRegEx)) {
        this._showCollaboratorRequiredError = false;
        this._showCollaboratorInvalidError = false;

        this.innovationService.inviteCollaborators(this.project._id, this.collaborators_emails).first()
          .subscribe((data: any) => {

            if (data.usersAdded.length || data.invitationsToSend.length || data.invitationsToSendAgain.length) {
              this._collaboratorsAddingProcess = data;
              this._collaboratorsAddingProcess.inviteUrl = this.innovationService.getInvitationUrl();

              if (data.invitationsToSend.length) {
                this._collaboratorsInvited.push(this._collaboratorsAddingProcess.invitationsToSend.toString());
                window.location.href = 'mailto:' + this._collaboratorsAddingProcess.invitationsToSend.join(',') + '?body=' + this._collaboratorsAddingProcess.inviteUrl;
              }

              if (data.invitationsToSendAgain.length) {

                if (this._collaboratorsInvited.length !== 0) {

                  const index = this._collaboratorsInvited.indexOf(this.collaborators_emails.toString());

                  if (index === -1) {
                    this._collaboratorsInvited.push(this._collaboratorsAddingProcess.invitationsToSendAgain.toString());
                  }

                  window.location.href = 'mailto:' + this._collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this._collaboratorsAddingProcess.inviteUrl;

                } else {
                  this._collaboratorsInvited.push(this._collaboratorsAddingProcess.invitationsToSendAgain.toString());
                  window.location.href = 'mailto:' + this._collaboratorsAddingProcess.invitationsToSendAgain.join(',') + '?body=' + this._collaboratorsAddingProcess.inviteUrl;
                }

              }

              if (data.usersAdded.length) {
                this.project.collaborators = this.project.collaborators.concat(data.usersAdded);
                this.translateNotificationsService.success('PROJECT_MODULE.COLLABORATOR_ADDED.TITLE', 'PROJECT_MODULE.COLLABORATOR_ADDED.CONTENT');
              }

            } else {
              this.translateNotificationsService.success('PROJECT_MODULE.COLLABORATOR_ALREADY_ADDED.TITLE', 'PROJECT_MODULE.COLLABORATOR_ALREADY_ADDED.CONTENT');
            }
            this.collaborators_emails = '';
          });
      } else {
        this._showCollaboratorRequiredError = false;
        this._showCollaboratorInvalidError = true;
      }

    }

  }

  reinviteCollaborator(event: Event, email: string) {
    event.preventDefault();

    this.innovationService.inviteCollaborators(this.project._id, email).first().subscribe((data) => {
      window.location.href = 'mailto:' + data.invitationsToSendAgain.join(',') + '?body=' + this.innovationService.getInvitationUrl();
    });

  }

  removeCollaborator(event: Event, value: any) {
    event.preventDefault();

    this.innovationService.removeCollaborator(this.project._id, value).subscribe((data) => {
      this.project.collaborators = data;
      this.translateNotificationsService.success('PROJECT_MODULE.COLLABORATOR_DELETED.TITLE', 'PROJECT_MODULE.COLLABORATOR_DELETED.CONTENT');
    });

  }

  editCollaborator(event: Event) {
    event.preventDefault();

    this.sidebarAnimateState = 'active';

    this.collaboratorValues = {
      addedLength: this.project.collaborators.length,
      invitedLength: this.collaboratorsInvited.length
    };

    this._displayAddCollaboratorsModal = true;
    this._showCollaboratorRequiredError = false;
    this._showCollaboratorInvalidError = false;

  }

  closeSidebar(value: string) {
    this.sidebarAnimateState = value;
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._displayAddCollaboratorsModal = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.getCurrentScrollTop() > 10) {
      this._scrollButton = true;
    } else {
      this._scrollButton = false;
    }
  }

  getCurrentScrollTop() {
    if (typeof window.scrollY !== 'undefined' && window.scrollY >= 0) {
      return window.scrollY;
    }
    return 0;
  };

  scrollToTop(event: Event) {
    event.preventDefault();
    window.scrollTo(0, 0);
  }

  get scrollButton(): boolean {
    return this._scrollButton;
  }

  get currentPage(): string {
    return this._currentPage;
  }

  get imgType(): string {
    return this._imgType;
  }

  get displayAddCollaboratorsModal(): boolean {
    return this._displayAddCollaboratorsModal;
  }

  get showCollaboratorRequiredError(): boolean {
    return this._showCollaboratorRequiredError;
  }

  get showCollaboratorInvalidError(): boolean {
    return this._showCollaboratorInvalidError;
  }

  get collaboratorsInvited(): Array<string> {
    return this._collaboratorsInvited;
  }

  get collaboratorsAddingProcess(): any {
    return this._collaboratorsAddingProcess;
  }

}

