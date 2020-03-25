import { Component, Inject, OnInit, PLATFORM_ID}  from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../models/innovation';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { ClientProject } from '../../../../../models/client-project';

@Component({
  selector: 'new-project',
  templateUrl: 'new-project.component.html',
  styleUrls: ['new-project.component.scss']
})

export class NewProjectComponent implements OnInit {

  currentStep = 0;

  fields: Array<string> = ['TITLE', 'PRIMARY_OBJECTIVE', 'SECONDARY_OBJECTIVE', 'RESTITUTION_DATE'];

  heading = '';

  isLoading = true;

  clientProject: ClientProject = {
    name: '',
    commercial: '',
    client: '',
    marketTests: [],
    roadmapDates: []
  };

  private _formData: FormGroup;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateTitleService: TranslateTitleService,
              private router: Router,
              private formBuilder: FormBuilder,
              private innovationService: InnovationService,
              private translateNotificationService: TranslateNotificationsService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.NEW_PROJECT');

  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this.isLoading = false;
    }
    this.buildForm();
  }

  /***
   *
   * @param event
   * @param step
   * @param type
   */
  public changeStep(event: Event, step: number, type: string) {
    event.preventDefault();

    if (type === 'next') {
      this.clientProject.roadmapDates[this.currentStep] = {
        name: 'STEP_' + (this.currentStep + 1),
        code: 'NEW_PROJECT',
        date: new Date()
      };
    }

    this.currentStep = step;

  }

  /***
   * based on the conditions of the fields this make the
   * next button disabled/enabled.
   */
  get isDisabled(): boolean {
    switch (this.fields[this.currentStep]) {

      case 'TITLE':
        return !this.clientProject.name;

      case 'PRIMARY_OBJECTIVE':
        break;

    }

    return true;
  }


  private buildForm() {
    this._formData = this.formBuilder.group({
      choosenLang: [null, Validators.required],
      name: [null, Validators.required]
    });
  }

  onCreateProject() {

    const newProject = {
      domain: environment.domain,
      lang: this._formData.value.choosenLang,
      name: this._formData.value.name,
    };

    this.innovationService.create(newProject).pipe(first()).subscribe((innovation: Innovation) => {
        this.router.navigate(['/user/projects/' + innovation._id + '/setup']);
      }, () => {
      this.translateNotificationService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }

  get formData(): FormGroup {
    return this._formData;
  }

}
