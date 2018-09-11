import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-new-project',
  templateUrl: 'new-project.component.html',
  styleUrls: ['new-project.component.scss']
})

export class NewProjectComponent implements OnInit {

  private _formData: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private innovationService: InnovationService,
              private translateNotificationService: TranslateNotificationsService) {
  }

  ngOnInit() {
    this._formData = this.formBuilder.group({
      choosenLang: [null, Validators.required],
      name: [null, Validators.required],
      type: [null, Validators.required],
    });

  }

  onSubmit() {
    const newProject = {
      domain: environment.domain,
      lang: this._formData.value.choosenLang,
      name: this._formData.value.name,
      type: this._formData.value.type
    };

    this.innovationService.create(newProject).first().subscribe((project: Innovation) => {
        this.router.navigate(['/project/' + project._id + '/setup'])
      }, () => {
      this.translateNotificationService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR')
    });

  }

  get formData(): FormGroup {
    return this._formData;
  }

}
