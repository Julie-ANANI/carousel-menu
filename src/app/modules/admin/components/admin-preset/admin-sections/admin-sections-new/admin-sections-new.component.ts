import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { noSpacesValidator } from '../../directives/no-spaces.validator';

@Component({
  templateUrl: './admin-sections-new.component.html',
  styleUrls: ['./admin-sections-new.component.scss']
})
export class AdminSectionsNewComponent {

  public formData: FormGroup = this._formBuilder.group({
    name: ['', [Validators.required, noSpacesValidator()]]
  });

  constructor(private _router: Router,
              private _formBuilder: FormBuilder,
              private _presetService: PresetService) { }

  public onSubmit({value}: { value: any }) {
    const newSection = {
      domain: environment.domain,
      name: value.name,
      controlType: value.controlType
    };

    this._presetService.createSection(newSection)
      .first()
      .subscribe(section => {
        this._router.navigate(['/admin/presets/sections/' + section._id])
      });

  }

  get name(): AbstractControl { return this.formData.get('name'); }
}
