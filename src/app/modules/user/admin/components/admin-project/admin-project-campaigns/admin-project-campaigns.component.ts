import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { environment } from '../../../../../../../environments/environment';
import { Campaign } from '../../../../../../models/campaign';
import { Innovation } from '../../../../../../models/innovation';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { first } from 'rxjs/operators';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-admin-project-campaigns',
  templateUrl: 'admin-project-campaigns.component.html',
  styleUrls: ['admin-project-campaigns.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('300ms ease-in-out', keyframes([
              style({ opacity: 0, transform: 'translateX(-20%)', offset: 0 }),
              style({ opacity: 1, transform: 'translateX(0)',     offset: 1.0 }),
            ])
          )]
        ), { optional: true }),

      ])
    ])
  ]
})

export class AdminProjectCampaignsComponent implements OnInit {

  private _innovation: Innovation;

  private _form: FormGroup;

  private _newCampaign: any;

  private _campaigns: Array<Campaign> = [];

  private _activateModal: boolean = false;

  private _selectCampaign: any = null;

  public editCampaignName: {[propName: string]: boolean} = {};

  constructor(private activatedRoute: ActivatedRoute,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService,
              private campaignService: CampaignService,
              private authService: AuthService) { }

  ngOnInit() {
    this._innovation =  this.activatedRoute.snapshot.parent.data['innovation'];
    this.buildForm();
    this.getCampaigns();
  }


  private buildForm() {
    this._form = new FormGroup({
      title: new FormControl()
    });
  }


  private getCampaigns() {
    this.innovationService.campaigns(this._innovation._id).pipe(first()).subscribe((campaigns: any) => {
      this._campaigns = campaigns.result;
      },() => {
      this.translateNotificationsService.error('ERROR', 'ERROR.FETCHING_ERROR');
      });
  }


  getAuthorizationLevel(level: number): boolean {
    const adminLevel = this.authService.adminLevel;
    return adminLevel > level;
  }


  onClickAdd(event: Event) {
    event.preventDefault();

    let newTitle = undefined;

    if (this._innovation && this._innovation.name) {
      newTitle = this._innovation.name;
    } else {
      newTitle = 'New campaign';
    }

    this._newCampaign = {
      domain: environment.domain,
      innovation: this._innovation._id,
      owner: this._innovation.owner.id,
      title: (this._campaigns.length + 1) + '. ' + newTitle
    };

    this.campaignService.create(this._newCampaign).pipe(first()).subscribe((response: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.ADDED');
      this.campaigns.push(response);
    },() => {
      this.translateNotificationsService.error('ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  get campaigns(): Array<any> {
    return this._campaigns;
  }

  get activateModal(): boolean {
    return this._activateModal;
  }

  set activateModal(value: boolean) {
    this._activateModal = value;
  }

  public updateStats(event: Event, campaign: Campaign) {
    event.preventDefault();
    this.campaignService.updateStats(campaign._id)
      .pipe(first())
      .subscribe((stats: any) => {
        campaign.stats = stats;
      }, (error: any) => {
        this.translateNotificationsService.error('ERROR', error.message);
      });
  };

  public deleteCampaignModal(campaign: any) {
    this._activateModal = true;
    this._selectCampaign = campaign;
  }

  public deleteCampaign(event: Event) {
    event.preventDefault();
    this._activateModal = false;
    if (this._selectCampaign) {
      this.campaignService.remove(this._selectCampaign._id)
        .pipe(first())
        .subscribe((result: any) => {
          this._selectCampaign = null;
          this.getCampaigns();
          this.translateNotificationsService.success('Campaigns', 'The campaign and its pros. have been removed.');
        }, (error: any) => {
          this.translateNotificationsService.error('ERROR', error.message);
          this._selectCampaign = null;
        });
    }
  }

  public onSubmit(campaign: Campaign, event: Event) {
    event.preventDefault();
    campaign.title = this._form.get('title').value;
    this.campaignService.put(campaign)
      .pipe(first())
      .subscribe((result: any) => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.SUCCESS');
      }, (error: any) => {
        this.translateNotificationsService.error('ERROR', error.message);
        this._selectCampaign = null;
      });
  }

  public get form() { return this._form; }
}
