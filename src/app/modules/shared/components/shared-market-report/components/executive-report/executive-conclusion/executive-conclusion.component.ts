import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../../../../models/user.model';
import { environment } from '../../../../../../../../environments/environment';
import { Innovation } from '../../../../../../../models/innovation';

@Component({
  selector: 'app-executive-conclusion',
  templateUrl: './executive-conclusion.component.html',
  styleUrls: ['./executive-conclusion.component.scss']
})

export class ExecutiveConclusionComponent implements OnInit {

  @Input() set project(value: Innovation) {

    if (value.marketReport && value.marketReport.finalConclusion) {
      this._conclusion = value.marketReport.finalConclusion.conclusion;
    }

    this._operator = value.operator || null;

  }

  private _conclusion = '';

  private _operator: User;

  constructor() { }

  ngOnInit() {
  }

  getLogo(): string {
    return environment.logoSynthURL;
  }

  get conclusion(): string {
    return this._conclusion;
  }

  get operator(): User {
    return this._operator;
  }

}
