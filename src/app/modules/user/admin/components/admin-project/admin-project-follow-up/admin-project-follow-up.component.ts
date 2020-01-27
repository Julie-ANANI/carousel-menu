import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../../models/innovation';

@Component({
  selector: 'app-admin-project-follow-up',
  templateUrl: 'admin-project-follow-up.component.html',
  styleUrls: ['admin-project-follow-up.component.scss']
})

export class AdminProjectFollowUpComponent implements OnInit {

  private _innovation: Innovation = {};

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if (this._activatedRoute.snapshot.parent.data['innovation']) {
      this._innovation = this._activatedRoute.snapshot.parent.data['innovation'];
    }
  }

  get innovation(): Innovation {
    return this._innovation;
  }

}
