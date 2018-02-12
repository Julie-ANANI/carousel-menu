import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './admin-sections-new.component.html',
  styleUrls: ['./admin-sections-new.component.scss']
})
export class AdminSectionsNewComponent {

  public formData: FormGroup = this._formBuilder.group({
    name: ['', Validators.required]
  });

  constructor(private _router: Router,
              private _formBuilder: FormBuilder,
              private _presetService: PresetService) { }

  public onSubmit({value, valid}: { value: any, valid: boolean }) {
    const newSection = {
      domain: environment.domain,
      name: value.name,
      controlType: value.controlType
    };

    this._presetService.createSection(newSection)
      .first()
      .subscribe(section => {
        this._router.navigate(['/admin/sections/' + section._id])
      });

  }
}
