import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-client-project-new',
  templateUrl: './client-project-new.component.html',
  styleUrls: ['./client-project-new.component.scss']
})
export class ClientProjectNewComponent implements OnInit, OnDestroy {

  private _subscriptions: ISubscription;

  public formData: FormGroup = this._formBuilder.group({
    choosenLang: [null, Validators.required],
    name: ['', Validators.required]
  });


  constructor(private _router: Router,
              private _formBuilder: FormBuilder,
              private _innovationService: InnovationService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  public onSubmit({value, valid}: { value: any, valid: boolean }) {
    const newProject = {
      domain: environment.domain,
      lang: value.choosenLang,
      name: value.name
    };

    this._subscriptions = this._innovationService.create(newProject).subscribe(project => {
      this._router.navigate(['/projects/' + project._id + '/edit'])
    });

  }
}
