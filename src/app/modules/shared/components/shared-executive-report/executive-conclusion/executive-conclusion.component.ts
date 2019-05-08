import { Component, Input } from '@angular/core';
import { User } from '../../../../../models/user.model';
import { environment } from '../../../../../../environments/environment';
import { Innovation } from '../../../../../models/innovation';

@Component({
  selector: 'app-executive-conclusion',
  templateUrl: './executive-conclusion.component.html',
  styleUrls: ['./executive-conclusion.component.scss']
})

export class ExecutiveConclusionComponent {

  @Input() set project(value: Innovation) {

    if (value.marketReport && value.marketReport.finalConclusion) {
      this._conclusion = value.marketReport.finalConclusion.conclusion;
    }

    this._operator = value.operator || null;

  }

  private _conclusion = '';

  private _operator: User;

  public getURL(): string {
    return environment.companyURL;
  }

  getLogo(): string {
    return environment.logoSynthURL;
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi' || environment.domain === 'dynergie';
  }

  get conclusion(): string {
    return this._conclusion;
  }

  get operator(): User {
    return this._operator;
  }

}
