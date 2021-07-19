import {Component, OnDestroy, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  templateUrl: 'admin-project-synthesis.component.html',
  styleUrls: ['admin-project-synthesis.component.scss']
})

export class AdminProjectSynthesisComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _accessPath: Array<string> = ['projects', 'project', 'synthesis'];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _innovationFrontService: InnovationFrontService,
              private _rolesFrontService: RolesFrontService) { }

  ngOnInit(): void {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      if (!this._innovation._id) {
        this._innovation = innovation || <Innovation>{};
      } else {
        this._innovation.marketReport = innovation.marketReport;
        this._innovation.preset = innovation.preset;
        this._innovation.settings.reportingLang = innovation.settings.reportingLang;
        this._innovation.mission = innovation.mission;
        this._innovation = JSON.parse(JSON.stringify(this._innovation));
      }
    });
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
