import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';
import {Subject} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {takeUntil} from 'rxjs/operators';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {StatsInterface} from '../../admin-stats-banner/admin-stats-banner.component';
import {Config} from '../../../../../../models/config';
import {ConfigService} from '../../../../../../services/config/config.service';

@Component({
  templateUrl: './admin-project-collection.component.html',
  styleUrls: ['./admin-project-collection.component.scss']
})

export class AdminProjectCollectionComponent implements OnInit {

  isLoading = true;

  innovation: Innovation = <Innovation>{};

  statsConfig: Array<StatsInterface> = [];

  localConfig: Config = {
    fields: '',
    limit: this._configService.configLimit('admin-collection'),
    offset: '0',
    search: '{}',
    $or: '[{"_id": "5f03324de410e50c0171fd4b"}, {"_id": "5b17d0520a7f5bd3b779f728"}]',
    sort: '{ "created": -1 }'
  };

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this.isLoading = false;
      this._setStats();

      this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
        this.innovation = innovation || <Innovation>{};
        console.log(this.innovation.campaigns);
      });

    }
  }

  private _setStats() {
    this.statsConfig = [

    ];
  }

}
