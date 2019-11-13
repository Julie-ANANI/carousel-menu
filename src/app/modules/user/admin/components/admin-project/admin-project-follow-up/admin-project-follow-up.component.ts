import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../../models/innovation';

@Component({
  selector: 'app-admin-project-follow-up',
  templateUrl: 'admin-project-follow-up.component.html',
  styleUrls: ['admin-project-follow-up.component.scss']
})

export class AdminProjectFollowUpComponent {

  private _innovation: Innovation = <Innovation> {};

  constructor(private _activatedRoute: ActivatedRoute) {

    if (this._activatedRoute.snapshot.parent.data['innovation']) {
      this._innovation = this._activatedRoute.snapshot.parent.data['innovation'];
    }

  }

  get innovation(): Innovation {
    return this._innovation;
  }

}
