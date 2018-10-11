import {Component, OnDestroy, OnInit} from '@angular/core';
import { User } from '../../../../../../../models/user.model';
import { environment } from '../../../../../../../../environments/environment';
import {ResponseService} from '../../../services/response.service';
import {Subject} from 'rxjs/Subject';
import {Innovation} from '../../../../../../../models/innovation';

@Component({
  selector: 'app-executive-conclusion',
  templateUrl: './executive-conclusion.component.html',
  styleUrls: ['./executive-conclusion.component.scss']
})

export class ExecutiveConclusionComponent implements OnInit, OnDestroy {

  ngUnsubscribe: Subject<any> = new Subject();

  conclusionReceived: string;

  opContactReceived: User;

  constructor(private responseService: ResponseService) { }

  ngOnInit() {
    this.getProject();
  }

  private getProject() {
    this.responseService.getProject().takeUntil(this.ngUnsubscribe).subscribe((response: Innovation) => {
      if (response !== null) {
        this.opContactReceived = response.operator;
        this.conclusionReceived = response.marketReport.finalConclusion.conclusion || '';
      }
    });
  }

  getLogo(): string {
    return environment.logoSynthURL;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
