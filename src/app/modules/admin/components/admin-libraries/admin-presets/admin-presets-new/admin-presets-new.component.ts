import { Component } from '@angular/core';
 import { Router } from '@angular/router';
// import { environment } from '../../../../../../../environments/environment';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noSpacesValidator } from '../directives/no-spaces.validator';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-presets-new',
  templateUrl: './admin-presets-new.component.html',
  styleUrls: ['./admin-presets-new.component.scss']
})
export class AdminPresetsNewComponent {

  public formData: FormGroup = this._formBuilder.group({
    name: ['', [Validators.required, noSpacesValidator()]]
  });


  public errorquestionnaire = false;
  private _newPreset: {
    name: string,
    sections: Array<any>
  } = {
    name: '',
    sections: []
  };
  public created = false;

  constructor(private _router: Router,
              private _formBuilder: FormBuilder,
              private _presetService: PresetService) {

  }


  public createPreset() {
    this._presetService.create(this._newPreset).pipe(first()).subscribe((preset: any) => {
      this._newPreset = preset;
      this.errorquestionnaire = false;
      this.created = true;
      this._router.navigate(['/admin/libraries/questionnaire/' + preset._id])
    }, (error: any) => {
      error = JSON.parse(error);
      this.errorquestionnaire = true;
    });
  }

  public goBack() {
    this._router.navigate(['/admin/libraries/questionnaire/']);
  }

  get newPreset(): any { return this._newPreset;}
  get name(): AbstractControl { return this.formData.get('name'); }
}
