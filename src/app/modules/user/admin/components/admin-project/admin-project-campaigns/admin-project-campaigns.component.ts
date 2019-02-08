import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { environment } from '../../../../../../../environments/environment';
import { Campaign } from '../../../../../../models/campaign';
import { Innovation } from '../../../../../../models/innovation';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { first } from 'rxjs/operators';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';

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

  private _newCampaign: any;

  private _campaigns: Array<Campaign> = [];

  private _activateModal: boolean = false;

  private _selectCampaign: Campaign = null;

  private _sidebarValue: SidebarInterface = {};

  // public editCampaignName: {[propName: string]: boolean} = {};

  constructor(private activatedRoute: ActivatedRoute,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService,
              private campaignService: CampaignService,
              private authService: AuthService) { }

  ngOnInit() {
    this._innovation =  this.activatedRoute.snapshot.parent.data['innovation'];
    this.getCampaigns();
  }


  private getCampaigns() {
    this.innovationService.campaigns(this._innovation._id).pipe(first()).subscribe((campaigns: any) => {
      this._campaigns = campaigns.result;
      },() => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
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
      this._campaigns.push(response);
    },() => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  onClickEdit(event: Event, campaign: Campaign) {
    event.preventDefault();
    this._selectCampaign = campaign;

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'CAMPAIGNS.SIDEBAR.TITLE',
      type: 'editName'
    };

  }


  updateCampaign(formGroup: FormGroup) {
    this._selectCampaign.title = formGroup.value['title'];

    this.campaignService.put(this._selectCampaign).pipe(first()).subscribe((response: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.UPDATED');
      }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      this._selectCampaign = null;
    });

  }


  OnClickUpdateStatus(event: Event, campaign: Campaign) {
    event.preventDefault();

    this.campaignService.updateStats(campaign._id).pipe(first()).subscribe((stats: any) => {
      campaign.stats = stats;
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.UPDATED');
      }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  };


  OnClickDelete(event: Event, campaign: Campaign) {
    event.preventDefault();
    this._selectCampaign = campaign;
    this._activateModal = true;
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._activateModal = false;
  }


  onClickSubmit() {
    this.campaignService.remove(this._selectCampaign._id).pipe(first()).subscribe((response: any) => {
      this._selectCampaign = null;
      this.getCampaigns();
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.DELETED');
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
        this._selectCampaign = null;
    });
    this._activateModal = false;
  }


  get campaigns(): Array<any> {
    return this._campaigns;
  }

  get activateModal(): boolean {
    return this._activateModal;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  get selectCampaign(): Campaign {
    return this._selectCampaign;
  }

}
