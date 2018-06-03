import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../models/innovation';
import { emailRegEx } from '../../../../utils/regex';

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
  public displayCollaboratorsAddingProcess = false;
  public collaborators_emails = '';
  public collaboratorsAddingProcess: any = {
    usersAdded: [],
    invitationsToSend: [],
    invitationsToSendAgain: []
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private innovationService: InnovationService,
              private _router: Router) {
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

  public validCollaboratorsList(): boolean {
    let validCount = 0;

    const split = this.collaborators_emails.split(/[\s,;:]/g).filter(val => val !== '');

    split.forEach(mail => {
      if (mail.match(emailRegEx)) {
        validCount++;
      }
    });

    return validCount > 0 && validCount === split.length;

  }

  public addCollaborators (event: Event): void {
    event.preventDefault();

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
    }

  }

  get currentPage(): string {
    return this._currentPage;
  }

  get imgType(): string {
    return this._imgType;
  }

}
