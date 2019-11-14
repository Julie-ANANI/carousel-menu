import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../../models/innovation';
import {InnovationService} from "../../../../../../services/innovation/innovation.service";

@Component({
  selector: 'app-admin-project-follow-up',
  templateUrl: 'admin-project-follow-up.component.html',
  styleUrls: ['admin-project-follow-up.component.scss']
})

export class AdminProjectFollowUpComponent {

  private _innovation: Innovation = <Innovation> {};

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService) {

    if (this._activatedRoute.snapshot.parent.data['innovation']) {
      this._innovation = this._activatedRoute.snapshot.parent.data['innovation'];
    }

  }


  public updateFollowUpEmails() {
    this._innovationService.updateFollowUpEmails(this._innovation._id).subscribe((result: Innovation) => {
      this._innovation.followUpEmails = result.followUpEmails;
    });
  }


  get innovation(): Innovation {
    return this._innovation;
  }

}
