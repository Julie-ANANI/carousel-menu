import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-presets-new',
  templateUrl: './admin-presets-new.component.html',
  styleUrls: ['./admin-presets-new.component.scss']
})
export class AdminPresetsNewComponent {

  public formData: FormGroup = this._formBuilder.group({
    name: ['', Validators.required]
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
        this._router.navigate(['/admin/presets/' + preset._id])
      });

  }
}
