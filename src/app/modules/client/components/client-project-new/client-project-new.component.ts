import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Innovation } from '../../../../models/innovation';

@Component({
  selector: 'app-client-project-new',
  templateUrl: './client-project-new.component.html',
  styleUrls: ['./client-project-new.component.scss']
})
export class ClientProjectNewComponent {

  public formData: FormGroup = this._formBuilder.group({
    choosenLang: [null, Validators.required],
    name: ['', Validators.required]
  });

  constructor(private _router: Router,
              private _formBuilder: FormBuilder,
              private _innovationService: InnovationService) { }

  public onSubmit() {
    const newProject = {
      domain: environment.domain,
      lang: this.formData.value.choosenLang,
      name: this.formData.value.name
    };

    this._innovationService.create(newProject).first().subscribe((project: Innovation) => {
      this._router.navigate(['/projects/' + project._id + '/edit'])
    });

  }
}
