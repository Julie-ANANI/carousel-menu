import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Campaign} from '../../../../../../models/campaign';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {CampaignFrontService} from '../../../../../../services/campaign/campaign-front.service';
import {StatsReferentsService} from '../../../../../../services/stats-referents/stats-referents.service';
import {StatsInterface} from '../../admin-stats-banner/admin-stats-banner.component';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {Config} from '../../../../../../models/config';
import {SearchService} from '../../../../../../services/search/search.service';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';

export interface ProMailsStats {
  uniqueGoodEmails: number;
  uniqueBadEmails: number;
  uniqueUncertain: number;
  uniqueShielded: number;
  uniqueIdentified: number;
  identified: number;
}

export interface ProMailsIndicators {
  identificationEfficiency: string;
  shieldImpact: string;
  inabilityToValidate: string;
  redundancy: string;
  deductionEfficiency: string;
}

@Component({
  templateUrl: './admin-campaign-history.component.html',
  styleUrls: ['./admin-campaign-history.component.scss']
})

export class AdminCampaignHistoryComponent implements OnInit {

  private _configStats: Config = {
    fields: 'created status campaign innovation motherRequest totalResults metadata results',
    limit: '0',
    offset: '0',
    search: '{}',
    sort: '',
  };

  private _indicators: ProMailsIndicators;

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignFrontService: CampaignFrontService,
              private _rolesFrontService: RolesFrontService,
              private _statsReferentsService: StatsReferentsService,
              private _searchService: SearchService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }

  private _referents: { identificationEfficiency: any; shieldImpact?: number; inabilityToValidate?: number; redundancy?: number; deductionEfficiency?: number; };

  get referents(): { identificationEfficiency: any; shieldImpact?: number; inabilityToValidate?: number; redundancy?: number; deductionEfficiency?: number } {
    return this._referents;
  }

  private _stats: ProMailsStats;

  get stats(): ProMailsStats {
    return this._stats;
  }

  private _statsConfig: Array<StatsInterface> = [];

  get statsConfig(): Array<StatsInterface> {
    return this._statsConfig;
  }

  private _campaign: Campaign = <Campaign>{};

  get campaign(): Campaign {
    return this._campaign;
  }

  private _accessPath: Array<string> = ['projects', 'project', 'campaigns', 'campaign', 'history'];

  get accessPath(): Array<string> {
    return this._accessPath;
  }

  private static _getRate(value1: number, value2: number, decimals?: number): string {
    const power = decimals ? Math.pow(10, decimals) : 100;
    if (value2 && (value1 || value1 === 0)) {
      return (Math.round(100 * power * value1 / value2) / power).toString() + '%';
    }
    return 'NA';
  }

  ngOnInit(): void {
    this._activatedRoute.data.subscribe((data) => {
      if (data['campaign']) {
        this._campaign = data['campaign'];
        this._campaignFrontService.setActiveCampaign(this._campaign);
        this._campaignFrontService.setActiveCampaignTab('history');
        this._campaignFrontService.setLoadingCampaign(false);

        this._statsReferentsService.get().subscribe((referents) => {
          this._referents = referents.campaigns;
          this._stats = this.campaign.stats.pro;
          this.setIndicators();
          this._setStats();
        });
      }
    });
  }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
  }

  public loadStats() {
    this._configStats.campaign = this.campaign._id;
    this._searchService.getRequestsStats(this._configStats).pipe(first()).subscribe((result: any) => {
      if (result.stats) {
        this._stats = result.stats;
        this.setIndicators();
        this._setStats();
      }
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public setIndicators() {
    if (!this.stats) {
      this._indicators = {
        identificationEfficiency: 'NA',
        shieldImpact: 'NA',
        inabilityToValidate: 'NA',
        redundancy: 'NA',
        deductionEfficiency: 'NA',
      };
    } else {
      this._indicators = {
        identificationEfficiency:
          (this._stats.uniqueIdentified === 0) ? 'NA' : AdminCampaignHistoryComponent._getRate(this._stats && this._stats.uniqueGoodEmails
            , this._stats && this._stats.uniqueIdentified),
        shieldImpact:
          (this._stats.uniqueGoodEmails === 0) ? 'NA' : AdminCampaignHistoryComponent._getRate(this._stats && this._stats.uniqueShielded
            , this._stats && this._stats.uniqueGoodEmails),
        inabilityToValidate:
          (this._stats.uniqueIdentified === 0) ? 'NA' : AdminCampaignHistoryComponent._getRate(this._stats && this._stats.uniqueBadEmails
            , this._stats && this._stats.uniqueIdentified),
        redundancy:
          (this._stats.identified === 0) ? 'NA' : AdminCampaignHistoryComponent._getRate(this._stats && this._stats.uniqueIdentified
            , this._stats && this._stats.identified),
        deductionEfficiency:
          (this._stats.uniqueIdentified === 0) ? 'NA' : AdminCampaignHistoryComponent._getRate(this._stats && this._stats.uniqueUncertain
            , this._stats && this._stats.uniqueIdentified)
      };
    }
  }

  private _setStats() {
    this._statsConfig = [{
      heading: 'Emails',
      content: [
        {
          subHeading: 'Identification efficiency',
          value: this._indicators.identificationEfficiency,
          gauge: {
            title: `${this._stats && this._stats.uniqueGoodEmails} uniques good emails / ${this._stats && this._stats.uniqueIdentified} uniques identified`,
            referent: this._referents.identificationEfficiency || 50,
            delimitersLabels: ['Very low identification, to be alerted', 'Weak identification, to be checked', 'Identification ok', 'Identification better than ever !']
          }
        },
        {
          subHeading: 'Shield impact',
          value: this._indicators.shieldImpact,
          gauge: {
            title: `${this._stats && this._stats.uniqueShielded} uniques shielded / ${this._stats && this._stats.uniqueGoodEmails} uniques good emails`,
            inverted: true,
            referent: this._referents.shieldImpact || 50,
            delimitersLabels: ['Strong impact', 'Moderate impact', 'Low impact', 'Very low impact']
          }
        },
        {
          subHeading: 'Inability to validate',
          value: this._indicators.inabilityToValidate,
          gauge: {
            title: `${this._stats && this._stats.uniqueBadEmails} uniques invalids / ${this._stats && this._stats.uniqueIdentified} uniques identified`,
            inverted: true,
            referent: this._referents.inabilityToValidate || 50,
            delimitersLabels: ['Strong inability to validate, to be alerted', 'Moderate inability to validate, to be checked',
              'Inability to validate low', 'Inability to validate very low']            }
        },
        {
          subHeading: 'Redundancy',
          value: this._indicators.redundancy,
          gauge: {
            title: `${this._stats && this._stats.uniqueIdentified} uniques identified / ${this._stats && this._stats.identified} identified`,
            inverted: true,
            referent: this._referents.redundancy || 50,
            delimitersLabels: ['Highly redundant request, to be redirected', 'Redundant request, be careful', 'Request ok !', 'Request excellent !']
          }
        },
        {
          subHeading: 'Deduction efficiency',
          value: this._indicators.deductionEfficiency,
          gauge: {
            title: `${this._stats && this._stats.uniqueUncertain} uniques deduced / ${this._stats && this._stats.uniqueIdentified} uniques identified`,
            referent: this._referents.deductionEfficiency || 50,
            delimitersLabels: ['Very small deduction, to be alerted', 'Low deduction, to be checked', 'Deduction ok!', 'Strong deduction! ']
          }
        }
      ]
    }];
  }

}
