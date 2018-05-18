import { Component, OnInit } from '@angular/core';
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

export class NewProjectComponent implements OnInit {

  private _formData: FormGroup;

  constructor(private _router: Router,
              private _formBuilder: FormBuilder,
              private _innovationService: InnovationService) {
  }

  ngOnInit(): void {
    this._formData = this._formBuilder.group({
      choosenLang: [null, Validators.required],
      name: [null, Validators.required],
      type: [null, Validators.required],
    });

  }

  public onSubmit() {
    const newProject = {
      domain: environment.domain,
      lang: this._formData.value.choosenLang,
      name: this._formData.value.name,
      type: this._formData.value.type
    };

    this._innovationService.create(newProject)
      .first()
      .subscribe((project: Innovation) => {
        this._router.navigate(['/project/' + project._id + '/setup'])
      });

  }

  get formData(): FormGroup {
    return this._formData;
  }

}
