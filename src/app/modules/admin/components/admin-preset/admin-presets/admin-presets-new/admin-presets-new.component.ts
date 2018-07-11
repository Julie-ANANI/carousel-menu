import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noSpacesValidator } from '../../directives/no-spaces.validator';

@Component({
  selector: 'app-admin-presets-new',
  templateUrl: './admin-presets-new.component.html',
  styleUrls: ['./admin-presets-new.component.scss']
})
export class AdminPresetsNewComponent {

  public formData: FormGroup = this._formBuilder.group({
    name: ['', [Validators.required, noSpacesValidator()]]
  });


  constructor(private _router: Router,
              private _formBuilder: FormBuilder,
              private _presetService: PresetService) { }

  public onSubmit({value}: { value: any }) {
    const newPreset = {
      domain: environment.domain,
      name: value.name
    };

    this._presetService.create(newPreset)
      .first()
      .subscribe(preset => {
        this._router.navigate(['/admin/presets/presets/' + preset._id])
      });

  }

  get name(): AbstractControl { return this.formData.get('name'); }
}
