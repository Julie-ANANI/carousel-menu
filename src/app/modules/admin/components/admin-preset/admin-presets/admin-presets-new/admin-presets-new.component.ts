import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-presets-new',
  templateUrl: './admin-presets-new.component.html',
  styleUrls: ['./admin-presets-new.component.scss']
})
export class AdminPresetsNewComponent implements OnInit, OnDestroy {

  private _subscriptions: ISubscription;

  public formData: FormGroup = this._formBuilder.group({
    name: ['', Validators.required]
  });


  constructor(private _router: Router,
              private _formBuilder: FormBuilder,
              private _presetService: PresetService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this._subscriptions) this._subscriptions.unsubscribe();
  }

  public onSubmit({value, valid}: { value: any, valid: boolean }) {
    const newPreset = {
      domain: environment.domain,
      name: value.name
    };

    this._subscriptions = this._presetService.create(newPreset).subscribe(preset => {
      this._router.navigate(['/admin/presets/' + preset._id])
    });

  }
}
