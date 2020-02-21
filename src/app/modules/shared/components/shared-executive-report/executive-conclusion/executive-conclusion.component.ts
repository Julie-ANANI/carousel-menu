import { Component, Input } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Innovation } from '../../../../../models/innovation';

@Component({
  selector: 'app-executive-conclusion',
  templateUrl: './executive-conclusion.component.html',
  styleUrls: ['./executive-conclusion.component.scss']
})

export class ExecutiveConclusionComponent {

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
