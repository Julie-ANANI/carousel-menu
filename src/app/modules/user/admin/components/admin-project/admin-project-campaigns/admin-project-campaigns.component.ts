import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { environment } from '../../../../../../../environments/environment';
import { Campaign } from '../../../../../../models/campaign';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { SidebarInterface } from '../../../../../sidebars/interfaces/sidebar-interface';
import { isPlatformBrowser} from "@angular/common";
import { Response } from "../../../../../../models/response";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorFrontService } from "../../../../../../services/error/error-front.service";
import { first } from "rxjs/operators";
import { RolesFrontService } from "../../../../../../services/roles/roles-front.service";

@Component({
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

  private _innovation: Innovation = <Innovation>{};

  private _campaigns: Array<Campaign> = [];

  private _activateModal = false;

  private _selectCampaign: Campaign = <Campaign>{};

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  private _isLoading = true;

  private _fetchingError = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      if (this._activatedRoute.snapshot.parent.data['innovation']
        && typeof this._activatedRoute.snapshot.parent.data['innovation'] !== undefined) {
        this._innovation = this._activatedRoute.snapshot.parent.data['innovation'];
        if (this._innovation._id) {
          this._getCampaigns();
        }
      }
    }
  }

  private _getCampaigns() {
    this._innovationService.campaigns(this._innovation._id).pipe(first()).subscribe((response: Response) => {
      this._isLoading = false;
      this._campaigns = response && response.result || [];
    }, (err: HttpErrorResponse) => {
      this._fetchingError = true;
      this._isLoading = false;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'campaigns'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'campaigns']);
    }
  }

  _updateProject(innovation: Innovation) {
    this._innovation = innovation;
  }

  /***
   * when the user clicks on the Add campaign button.
   * @param event
   */
  public onAddCampaign(event: Event) {
    event.preventDefault();
    const _newTitle = this._innovation.name ? this._innovation.name : 'New campaign';

    const _newCampaign: any = {
      domain: environment.domain,
      innovation: this._innovation._id,
      owner: this._innovation.owner.id,
      title: (this._campaigns.length + 1) + '. ' + _newTitle
    };

    this._campaignService.create(_newCampaign).pipe(first()).subscribe((campaign: Campaign) => {
      this._campaigns.push(campaign);
      this._translateNotificationsService.success('Success', 'The new campaign is added.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  /***
   * when the user clicks on the Edit button.
   * @param event
   * @param campaign
   */
  public onEditCampaign(event: Event, campaign: Campaign) {
    event.preventDefault();
    this._selectCampaign = campaign;
    this._sidebarValue = {
      animate_state: 'active',
      title: this.canAccess(['edit']) ? 'Edit Campaign' : 'View Campaign',
      type: 'editName'
    };
  }

  /***
   * update the campaign through sidebar.
   * @param formGroup
   */
  public updateCampaign(formGroup: FormGroup) {
    this._selectCampaign.title = formGroup.value['title'];
    this._campaignService.put(this._selectCampaign).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('Success', 'The campaign is updated.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      this._selectCampaign = null;
      console.error(err);
    });
  }

  /***
   * clicks on the Update stats button
   * @param event
   * @param campaign
   */
  public onUpdateStats(event: Event, campaign: Campaign) {
    event.preventDefault();
    this._campaignService.updateStats(campaign._id).pipe(first()).subscribe((updatedCampaign: Campaign) => {
      campaign = updatedCampaign;
      this._translateNotificationsService.success('Success', 'The campaign stats is updated successfully.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  };

  /***
   * clicks on Delete button
   * @param event
   * @param campaign
   */
  public onDelete(event: Event, campaign: Campaign) {
    event.preventDefault();
    this._selectCampaign = campaign;
    this._activateModal = true;
  }

  /***
   * clicks on the Confirm button of the Delete modal.
   */
  public onConfirmDelete() {
    this._campaignService.remove(this._selectCampaign._id).pipe(first()).subscribe(() => {
      this._campaigns = this._campaigns.filter((c) => c._id !== this._selectCampaign._id);
      this._selectCampaign = null;
      this._translateNotificationsService.success('Success', 'The campaign is deleted successfully.');
      this._activateModal = false;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      this._selectCampaign = null;
      console.error(err);
    });
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

  get isLoading(): boolean {
    return this._isLoading;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

}
