import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ResponseService} from '../../services/response.service';
import {Subject} from 'rxjs/Subject';
import {Innovation} from '../../../../../../models/innovation';

@Component({
  selector: 'app-executive-report',
  templateUrl: './executive-report.component.html',
  styleUrls: ['./executive-report.component.scss']
})

export class ExecutiveReportComponent implements OnInit, OnDestroy {

  @Input() set mapInitialConfiguration(value: any) {
    this.initialConfigurationReceived = value;
  }

  ngUnsubscribe: Subject<any> = new Subject();

  initialConfigurationReceived: any;

  reportReceived: any;

  constructor(private responseService: ResponseService) { }

  ngOnInit() {
    this.getReport();
  }

  private getReport() {
    this.responseService.getProject().subscribe((response: Innovation) => {
      if (response !== null) {
        this.reportReceived = response.executiveReport;
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
