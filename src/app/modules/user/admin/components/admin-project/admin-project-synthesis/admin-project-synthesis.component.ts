import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {ExecutiveReport} from '../../../../../../models/executive-report';
import {isPlatformBrowser} from '@angular/common';
import {ExecutiveReportService} from '../../../../../../services/executive-report/executive-report.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {TranslateNotificationsService} from '../../../../../../services/translate-notifications/translate-notifications.service';

@Component({
  templateUrl: 'admin-project-synthesis.component.html',
})

export class AdminProjectSynthesisComponent implements OnInit, OnDestroy {

  get report(): ExecutiveReport {
    return this._report;
  }

  private _innovation: Innovation = <Innovation>{};

  private _accessPath: Array<string> = ['projects', 'project', 'synthesis'];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _report: ExecutiveReport = <ExecutiveReport>{};

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _innovationFrontService: InnovationFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _executiveReportService: ExecutiveReportService,
              private _rolesFrontService: RolesFrontService) { }

  ngOnInit(): void {
    this._innovation = this._innovationFrontService.innovation().value;
    this._getReport(this._innovation?.executiveReportId);

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      if (innovation && innovation._id) {
        this._innovation = innovation;
      }
      console.log(innovation.marketReport);
      console.log(this._innovation.marketReport);
      /*if (!this._innovation._id) {
        this._innovation = innovation || <Innovation>{};
        this._getReport(innovation.executiveReportId);
      } else {
        this._innovation.marketReport = innovation.marketReport;
        this._innovation.preset = innovation.preset;
        this._innovation.settings.reportingLang = innovation.settings.reportingLang;
        this._innovation.mission = innovation.mission;
        this._innovation = JSON.parse(JSON.stringify(this._innovation));
      }
      console.log(this._innovation);*/
    });
  }

  private _getReport(id: string) {
    if (isPlatformBrowser(this._platformId) && !!id) {
      this._executiveReportService.get(id).pipe(first()).subscribe((response) => {
        this._report = response;
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Report Fetching Error...', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    }
  }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
