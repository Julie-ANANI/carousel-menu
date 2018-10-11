import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../../../../models/user.model';
import {environment} from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-executive-conclusion',
  templateUrl: './executive-conclusion.component.html',
  styleUrls: ['./executive-conclusion.component.scss']
})
export class ExecutiveConclusionComponent implements OnInit {

  @Input() set conclusion(value: string) {
    this.conclusionReceived = value;
  }

  @Input() set operatorContact(value: User) {
    this.opContactReceived = value;
  }

  conclusionReceived: string;

  opContactReceived: User;

  constructor() { }

  ngOnInit() {
  }

  getLogo(): string {
    return environment.logoSynthURL;
  }

}
