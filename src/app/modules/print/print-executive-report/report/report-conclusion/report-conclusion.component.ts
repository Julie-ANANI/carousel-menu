import { Component, Input } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Innovation } from '../../../../../models/innovation';

@Component({
  selector: 'report-conclusion',
  templateUrl: './report-conclusion.component.html',
  styleUrls: ['./report-conclusion.component.scss']
})

export class ReportConclusionComponent {

  @Input() project: Innovation;

  public companyUrl(): string {
    return environment.companyURL;
  }

  public logo(): string {
    return environment.logoSynthURL;
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi' || environment.domain === 'dynergie';
  }

}
