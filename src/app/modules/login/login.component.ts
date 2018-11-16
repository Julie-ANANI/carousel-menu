import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from "../../services/title/title.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../environments/environment";
/*import { environment } from "../../../environments/environment";
import { first } from "rxjs/operators";
import { AuthService } from "../../services/auth/auth.service";
import { TranslateNotificationsService } from "../../services/notifications/notifications.service";*/

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formData: FormGroup;

  linkedInLink: string;

  constructor(private translateTitleService: TranslateTitleService,
              private formBuilder: FormBuilder,
              // private authService: AuthService,
              // private translateNotificationsService: TranslateNotificationsService
              ) { }

  ngOnInit() {
    this.translateTitleService.setTitle('LOG_IN.TITLE');
    this.buildForm();
    // this.linkedInUrl();
  }

  private buildForm() {
    this.formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /*private linkedInUrl() {
    const domain = environment.domain;

    this.authService.linkedinLogin(domain).pipe(first()).subscribe(
      (url: string) => {
        this.linkedInLink = url;
      }, (error: any) => {
        this.translateNotificationsService.error('ERROR.ERROR', error.message);
      }
    );

  }*/

  onContinue() {

  }

  getBackgroundImage(): string {
    return environment.background;
  }

  getCompanyUrl(): string {
    return environment.companyURL || '';
  }

  getLogoWBG(): string {
    return environment.logoSynthURL;
  }

  checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

}
