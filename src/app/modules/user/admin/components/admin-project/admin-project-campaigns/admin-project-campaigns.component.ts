import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { environment } from '../../../../../../../environments/environment';
import { Campaign } from '../../../../../../models/campaign';
import { Innovation } from '../../../../../../models/innovation';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { SidebarInterface } from '../../../../../sidebars/interfaces/sidebar-interface';

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

  private _activateModal = false;

  private _selectCampaign: Campaign = null;

  private _sidebarValue: SidebarInterface = {};

  constructor(private activatedRoute: ActivatedRoute,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService,
              private campaignService: CampaignService,
              private authService: AuthService) {

    this._innovation = this.activatedRoute.snapshot.parent.data['innovation'];

  }

  ngOnInit() {
    if (this._innovation && this._innovation._id) {
      this.innovationService.campaigns(this._innovation._id).subscribe((campaigns: any) => {
        this._campaigns = campaigns.result;
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
      });
    }
  }

  _updateProject(innovation: Innovation) {
    this._innovation = innovation;
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

    this.campaignService.create(this._newCampaign).subscribe((response: Campaign) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.ADDED');
      this._campaigns.push(response);
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  onClickEdit(event: Event, campaign: Campaign) {
    event.preventDefault();
    this._selectCampaign = campaign;

    this._sidebarValue = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.EDIT_CAMPAIGN',
      type: 'editName'
    };

  }


  updateCampaign(formGroup: FormGroup) {
    this._selectCampaign.title = formGroup.value['title'];

    this.campaignService.put(this._selectCampaign).subscribe((response: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.UPDATED');
      }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      this._selectCampaign = null;
    });

  }


  onClickUpdateStatus(event: Event, campaign: Campaign) {
    event.preventDefault();

    this.campaignService.updateStats(campaign._id).subscribe((updatedCampaign: any) => {
      campaign = updatedCampaign;
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.UPDATED');
      }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  };


  onClickDelete(event: Event, campaign: Campaign) {
    event.preventDefault();
    this._selectCampaign = campaign;
    this._activateModal = true;
  }


  onClickSubmit() {
    this.campaignService.remove(this._selectCampaign._id).subscribe((response: any) => {
      this._campaigns = this._campaigns.filter((c) => c._id !== this._selectCampaign._id);
      this._selectCampaign = null;
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

  set activateModal(value: boolean) {
    this._activateModal = value;
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
