import {Component, OnDestroy, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {Subject} from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import {InnovationService} from '../../../../../../services/innovation/innovation.service';
import {SocketService} from '../../../../../../services/socket/socket.service';

@Component({
  selector: 'app-admin-project-statistics',
  templateUrl: './admin-project-statistics.component.html',
  styleUrls: ['./admin-project-statistics.component.scss']
})
export class AdminProjectStatisticsComponent implements OnInit, OnDestroy {
  public isFetchingPros = false;
  public fetchingError = false;
  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _innovationFrontService: InnovationFrontService,
              private _rolesFrontService: RolesFrontService,
              private _innovationService: InnovationService,
              private _socketService: SocketService) {
  }

  private _stats: {
    byCountries: [{ flag: string, count: number }],
    byCompanies: [{ name: string, count: number }],
    byJobTitle: [{ name: string, count: number }]
  };

  get stats(): {
    byCountries: [{ flag: string; count: number }];
    byCompanies: [{ name: string; count: number }];
    byJobTitle: [{ name: string; count: number }]
  } {
    return this._stats;
  }

  private _socketListening = false;
  private _innovation: Innovation = <Innovation>{};

  get innovation(): Innovation {
    return this._innovation;
  }

  private _accessPath: Array<string> = ['projects', 'project', 'statistics'];

  get accessPath(): Array<string> {
    return this._accessPath;
  }

  ngOnInit(): void {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation || <Innovation>{};

      this.fetchProfessionalsRepartition();
    });
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(this._accessPath.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  fetchProfessionalsRepartition() {
    if (!this.isFetchingPros) {
      this.isFetchingPros = true;

      const _config: any = {
        fields: 'firstName lastName company email country jobTitle innovations',
        search: '{"emailConfidence":90}',
        limit: '-1'
      };

      if (!this._socketListening) {
        this._socketService.getProsRepartition(this._innovation._id)
          .pipe(takeUntil(this._ngUnsubscribe))
          .subscribe((res: any) => {
            this.isFetchingPros = false;
            this._stats = res;
          }, (error) => {
            this.isFetchingPros = false;
          });
        this._socketListening = true;
      }

      this._innovationService.repartition(this._innovation._id, _config)
        .pipe(first()).subscribe((res) => {
        this.isFetchingPros = false;
        this._stats = res;
      });
    }
  }
}


