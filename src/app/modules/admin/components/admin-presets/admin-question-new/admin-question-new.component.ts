import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { PresetService } from '../../../../../services/preset/preset.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-admin-question-new',
  templateUrl: './admin-question-new.component.html',
  styleUrls: ['./admin-question-new.component.scss']
})
export class AdminQuestionNewComponent implements OnInit, OnDestroy {

  private _subscriptions: ISubscription;

  public formData: FormGroup = this._formBuilder.group({
    identifier: ['', Validators.required],
    controlType: ['', Validators.required]
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
    const newQuestion = {
      domain: environment.domain,
      identifier: value.identifier,
      controlType: value.controlType
    };

    this._subscriptions = this._presetService.createQuestion(newQuestion).subscribe(question => {
      this._router.navigate(['/admin/questions/' + question._id + '/edit'])
    });

  }
}
