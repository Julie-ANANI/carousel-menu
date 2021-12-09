import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import { StatsReferentsService } from '../../../../../../services/stats-referents/stats-referents.service';
import { StatsInterface } from '../../../../../../models/stats';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import {  TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { CommonService } from '../../../../../../services/common/common.service';import {CampaignService} from '../../../../../../services/campaign/campaign.service';

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
})

export class AdminCampaignHistoryComponent implements OnInit {

  private _indicators: ProMailsIndicators;

  private _referents: { identificationEfficiency: any; shieldImpact?: number; inabilityToValidate?: number; redundancy?: number; deductionEfficiency?: number; };

  private _stats: ProMailsStats;

  private _statsConfig: Array<StatsInterface> = [];

  private _campaign: Campaign = <Campaign>{};

  private _accessPath: Array<string> = ['projects', 'project', 'campaigns', 'campaign', 'history'];


  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignFrontService: CampaignFrontService,
              private _rolesFrontService: RolesFrontService,
              private _statsReferentsService: StatsReferentsService,
              private _campaignService: CampaignService,
              private _translateNotificationsService: TranslateNotificationsService) {
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
          this._stats = (this.campaign.stats && !!this.campaign.stats.pro) ? this.campaign.stats.pro : {
            uniqueGoodEmails: 0,
            uniqueBadEmails: 0,
            uniqueUncertain: 0,
            uniqueShielded: 0,
            uniqueIdentified: 0,
            identified: 0
          };
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
    this._campaignService.getUpdatedHistoryStats(this.campaign._id).pipe(first()).subscribe((result: any) => {
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
          (this._stats.uniqueIdentified === 0) ? 'NA' : CommonService.getRate(this._stats && this._stats.uniqueGoodEmails
            , this._stats && this._stats.uniqueIdentified),
        shieldImpact:
          (this._stats.uniqueGoodEmails === 0) ? 'NA' : CommonService.getRate(this._stats && this._stats.uniqueShielded
            , this._stats && this._stats.uniqueGoodEmails),
        inabilityToValidate:
          (this._stats.uniqueIdentified === 0) ? 'NA' : CommonService.getRate(this._stats && this._stats.uniqueBadEmails
            , this._stats && this._stats.uniqueIdentified),
        redundancy:
          (this._stats.identified === 0) ? 'NA' : CommonService.getRate(this._stats && this._stats.uniqueIdentified
            , this._stats && this._stats.identified),
        deductionEfficiency:
          (this._stats.uniqueIdentified === 0) ? 'NA' : CommonService.getRate(this._stats && this._stats.uniqueUncertain
            , this._stats && this._stats.uniqueIdentified)
      };
    }
  }

  private _setStats() {
    this._statsConfig = [{
      heading: 'Emails',
      content: [
        {
          subHeading: 'Bad emails',
          value: this._indicators.inabilityToValidate,
          gauge: {
            title: `${this._stats && this._stats.uniqueBadEmails} uniques invalids / ${this._stats && this._stats.uniqueIdentified} uniques identified`,
            negative: true,
            referent: this._referents.inabilityToValidate || 50,
            delimitersLabels: ['Strong inability to validate, to be alerted', 'Moderate inability to validate, to be checked',
              'Inability to validate low', 'Inability to validate very low']
          }
        },
        {
          subHeading: 'Risky emails',
          value: this._indicators.deductionEfficiency,
          gauge: {
            title: `${this._stats && this._stats.uniqueUncertain} uniques risky / ${this._stats && this._stats.uniqueIdentified} uniques identified`,
            referent: this._referents.deductionEfficiency || 50,
            delimitersLabels: ['Very small deduction, to be alerted', 'Low deduction, to be checked', 'Deduction ok!', 'Strong deduction! ']
          }
        },
        {
          subHeading: 'Good emails',
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
            negative: true,
            referent: this._referents.shieldImpact || 50,
            delimitersLabels: ['Strong impact', 'Moderate impact', 'Low impact', 'Very low impact']
          }
        },
        {
          subHeading: 'Redundancy',
          value: this._indicators.redundancy,
          gauge: {
            title: `${this._stats && this._stats.uniqueIdentified} uniques identified / ${this._stats && this._stats.identified} identified`,
            negative: true,
            referent: this._referents.redundancy || 50,
            delimitersLabels: ['Highly redundant request, to be redirected', 'Redundant request, be careful', 'Request ok !', 'Request excellent !']
          }
        }
      ]
    }];
  }

  get stats(): ProMailsStats {
    return this._stats;
  }

  get statsConfig(): Array<StatsInterface> {
    return this._statsConfig;
  }

  get campaign(): Campaign {
    return this._campaign;
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

}
