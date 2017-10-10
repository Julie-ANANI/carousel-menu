import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-project-new',
  templateUrl: './client-project-new.component.html',
  styleUrls: ['./client-project-new.component.scss']
})
export class ClientProjectNewComponent implements OnInit {

  public formData: FormGroup = this._formBuilder.group({
    choosenLang: [null, Validators.required]
  });


  constructor(private _router: Router,
              private _formBuilder: FormBuilder,
              private _innovationService: InnovationService,
              private _translateService: TranslateService) { }

  ngOnInit() {
    initTranslation(this._translateService);
  }

  public onSubmit({value, valid}: { value: any, valid: boolean }) {
    const newProject = {
      domain: environment.domain,
      lang: value.choosenLang
    };

    this._innovationService.create(newProject).subscribe(project => {
      this._router.navigate(['/projects/' + project._id + '/edit'])
    });
  }
}
