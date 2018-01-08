import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { PresetService } from '../../../../../services/preset/preset.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-admin-section-new',
  templateUrl: './admin-section-new.component.html',
  styleUrls: ['./admin-section-new.component.scss']
})
export class AdminSectionNewComponent implements OnInit, OnDestroy {

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
    const newSection = {
      domain: environment.domain,
      name: value.name,
      controlType: value.controlType
    };

    this._subscriptions = this._presetService.createSection(newSection).subscribe(section => {
      this._router.navigate(['/admin/sections/' + section._id + '/edit'])
    });

  }
}
