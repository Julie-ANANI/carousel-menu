import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';

@Component({
  selector: 'app-new-project',
  templateUrl: 'new-project.component.html',
  styleUrls: ['new-project.component.scss']
})
export class NewProjectComponent {

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

    this._innovationService.create(newProject)
      .first()
      .subscribe((project: Innovation) => {
        this._router.navigate(['/project/' + project._id + '/setup'])
      });

  }
}
