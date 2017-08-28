import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { User } from '../../../../models/user.model';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/switchMap';
import { Compozer } from '../../../../utils/dynamic-form-compozer/classes/compozer';
import { TextboxCompozerComponent } from '../../../../utils/dynamic-form-compozer/classes/compozer-textbox';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.styl']
})
export class AdminUserComponent implements OnInit {

  public user: User = new User();
  public dataLoaded = false;



  public compozerComponents: Compozer = new Compozer([
    [
      new TextboxCompozerComponent({
        key: 'firstName',
        label: 'COMMON.FIRSTNAME',
        type: 'text',
        placeholder: 'John',
        validators: Validators.required
      })
    ],
    [
      new TextboxCompozerComponent({
        key: 'lastName',
        label: 'COMMON.LASTNAME',
        type: 'text',
        placeholder: 'Doe',
        validators: Validators.required
      })
    ],
    [
      new TextboxCompozerComponent({
        key: 'email',
        label: 'COMMON.EMAIL',
        type: 'email',
        disabled: true,
        placeholder: 'john.doe@gmail.com',
        validators: [Validators.required, Validators.email]
      })
    ],
    [
      new TextboxCompozerComponent({
        key: 'phone',
        label: 'COMMON.PHONE',
        type: 'tel',
        placeholder: '+33 4 05 06 07 08'
      })
    ]
  ]);


  constructor(private _userService: UserService,
              private _route: ActivatedRoute,
              private _titleService: Title) {}



  public formOnInit(form) {
    /*this._route.params.switchMap((params: Params) => {
      return this._userService.get(params['userId']).subscribe((user: User) => {
        form.patchValue(user); // TODO form
        this._titleService.setTitle('User ' + user.firstName + ' ' + user.lastName); // TODO translate
      });
    });*/

    /*this._userService.getSelf().subscribe(user => {
        this._loadingService.stopLoading();
        form.patchValue(user); // TODO form
    });*/
  }

  ngOnInit(): void {
  }

}
