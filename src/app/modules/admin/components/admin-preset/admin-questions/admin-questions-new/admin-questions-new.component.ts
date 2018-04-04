import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { noSpacesValidator } from '../../directives/no-spaces.validator';

@Component({
  templateUrl: './admin-questions-new.component.html',
  styleUrls: ['./admin-questions-new.component.scss']
})
export class AdminQuestionsNewComponent {

  public formData: FormGroup = this._formBuilder.group({
    identifier: ['', [Validators.required, noSpacesValidator()]],
    controlType: ['', Validators.required]
  });


  constructor(private _router: Router,
              private _formBuilder: FormBuilder,
              private _presetService: PresetService) { }

  public onSubmit({value}: { value: any }) {
    const newQuestion = {
      domain: environment.domain,
      identifier: value.identifier,
      controlType: value.controlType
    };

    this._presetService.createQuestion(newQuestion)
      .first()
      .subscribe(question => {
        this._router.navigate(['/admin/questions/' + question._id])
      });

  }

  get identifier(): AbstractControl { return this.formData.get('identifier'); }
}
