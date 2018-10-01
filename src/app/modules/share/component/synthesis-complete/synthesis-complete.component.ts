import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { environment } from '../../../../../environments/environment';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../models/innovation';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-synthesis-online',
  templateUrl: './synthesis-complete.component.html',
  styleUrls: ['./synthesis-complete.component.scss']
})

export class SynthesisCompleteComponent implements OnInit {
  projectId: string;
  project: Innovation;
  displaySpinner = false;

  constructor(private _authService: AuthService,
              private translateTitleService: TranslateTitleService,
              private activatedRoute: ActivatedRoute,
              private innovationService: InnovationService,
              private translateNotififcationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this.translateTitleService.setTitle('SHARE.TITLE');

    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });

    this.getProject();

    console.log(this.authService.isAuthenticated);
  }


  private getProject() {
    this.innovationService.get(this.projectId).subscribe((response: Innovation) => {
      this.project = response;
    }, () => {
      this.translateNotififcationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR')
    }, () => {
      this.displaySpinner = true;
    });
  }

  /***
   * We are checking user is authenticated or not.
   * @returns {AuthService}
   */
  get authService(): AuthService {
    return this._authService;
  }


  /***
   * We are getting the logo of the company.
   * @returns {string}
   */
  getLogo(): string {
    return environment.logoURL;
  }

}
