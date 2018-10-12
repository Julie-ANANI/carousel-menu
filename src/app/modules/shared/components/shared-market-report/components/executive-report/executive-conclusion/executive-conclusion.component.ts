import {Component, Input, OnInit} from '@angular/core';
import { User } from '../../../../../../../models/user.model';
import { environment } from '../../../../../../../../environments/environment';
import {Innovation} from '../../../../../../../models/innovation';

@Component({
  selector: 'app-executive-conclusion',
  templateUrl: './executive-conclusion.component.html',
  styleUrls: ['./executive-conclusion.component.scss']
})

export class ExecutiveConclusionComponent implements OnInit {

  @Input() set innovation(value: Innovation) {
    this.conclusion = value.marketReport.finalConclusion.conclusion || '';
    this.operator = value.operator || null;
  }

  conclusion: string;

  operator: User;

  constructor() { }

  ngOnInit() {
  }

  getLogo(): string {
    return environment.logoSynthURL;
  }

}
