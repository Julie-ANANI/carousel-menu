import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { environment } from '../../../../../../../environments/environment';
import { Campaign } from '../../../../../../models/campaign';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import {
  animate,
  keyframes,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { Response } from '../../../../../../models/response';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { first, takeUntil } from 'rxjs/operators';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { Subject } from 'rxjs';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import { SocketService } from '../../../../../../services/socket/socket.service';
import { QuizService } from '../../../../../../services/quiz/quiz.service';
import { CommonService } from '../../../../../../services/common/common.service';
import {UmiusSidebarInterface} from '@umius/umi-common-component';

@Component({
  templateUrl: 'admin-project-campaigns.component.html',
  styleUrls: ['admin-project-campaigns.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({opacity: 0}), {optional: true}),
        query(
          ':enter',
          stagger('200ms', [
            animate(
              '200ms ease-in-out',
              keyframes([
                style({opacity: 0, transform: 'translateX(-20%)', offset: 0}),
                style({opacity: 1, transform: 'translateX(0)', offset: 1.0}),
              ])
            ),
          ]),
          {optional: true}
        ),
      ]),
    ]),
  ],
})
export class AdminProjectCampaignsComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _campaigns: Array<Campaign> = [];

  private _activateModal = false;

  private _selectCampaign: Campaign = <Campaign>{};

  private _sidebarValue: UmiusSidebarInterface = <UmiusSidebarInterface>{};

  private _isLoading = true;

  private _fetchingError = false;

  private _isAddingCampaign = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _innovationService: InnovationService,
              private _innovationFrontService: InnovationFrontService,
              private _campaignFrontService: CampaignFrontService,
              private _rolesFrontService: RolesFrontService,
              private _commonService: CommonService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _socketService: SocketService,
              private _campaignService: CampaignService,) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._innovation = this._innovationFrontService.innovation().value;

      if (!this._campaigns.length && this._innovation._id) {
        this._getCampaigns();
      }

      this._socketService.getNewCampaign(this._innovation._id).pipe(takeUntil(this._ngUnsubscribe)).subscribe((update: any) => {
        this._campaigns.push(update.data);
        this._setAllCampaigns();
        }, (error: HttpErrorResponse) => {
        console.error(error);
      });
    }
  }

  private _getCampaigns() {
    this._innovationService.campaigns(this._innovation._id).pipe(first()).subscribe((response: Response) => {
      this._isLoading = false;
      this._campaigns = (response && response.result) || [];
      this._campaigns = CommonService.sortByCompare(this._campaigns, 'title');
      this._setAllCampaigns();
    }, (err: HttpErrorResponse) => {
      this._fetchingError = true;
      this._isLoading = false;
      this._translateNotificationsService.error('Campaigns Fetching Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    }
  );
  }

  private _setAllCampaigns() {
    this._campaignFrontService.setAllCampaigns(this._campaigns);
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(
        ['projects', 'project', 'campaigns'].concat(path)
      );
    } else {
      return this._rolesFrontService.hasAccessAdminSide([
        'projects',
        'project',
        'campaigns',
      ]);
    }
  }

  /***
   * when the user clicks on the Add campaign button.
   * @param event
   */
  public onAddCampaign(event: Event) {
    event.preventDefault();
    if (!this._isAddingCampaign) {
      this._isAddingCampaign = true;
      const _newTitle = this._innovation.name
        ? this._innovation.name
        : 'New campaign';

      const _newCampaign: any = {
        domain: environment.domain,
        innovation: this._innovation._id,
        owner: this._innovation.owner._id || this._innovation.owner.id,
        title: this._campaigns.length + 1 + '. ' + _newTitle,
      };

      this._campaignService
        .create(_newCampaign)
        .pipe(first())
        .subscribe(
          (_) => {
            this._translateNotificationsService.success(
              'Success',
              'The new campaign is added.'
            );
            this._isAddingCampaign = false;
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error(
              'Campaign Adding Error...',
              ErrorFrontService.getErrorKey(err.error)
            );
            this._isAddingCampaign = false;
            console.error(err);
          }
        );
    }
  }

  public onNavigation(campaign: Campaign) {
    this._campaignFrontService.setActiveCampaign(campaign);
    this._campaignFrontService.setShowCampaignTabs(true);
  }

  public route(id: string): string {
    return `/user/admin/projects/project/${
      this._innovation._id
    }/preparation/campaigns/campaign/${id}/${this._rolesFrontService.campaignDefaultRoute()}`;
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
      title: this.canAccess(['edit']) ? 'Edit Campaign' : 'Campaign',
      type: 'EDIT_NAME',
    };
  }

  /***
   * update the campaign through sidebar.
   * @param formGroup
   */
  public updateCampaign(formGroup: FormGroup) {
    this._selectCampaign.title = formGroup.value['title'];
    this._selectCampaign.rgpd = formGroup.value['rgpd'];
    this._campaignService
      .put(this._selectCampaign)
      .pipe(first())
      .subscribe(
        () => {
          this._translateNotificationsService.success(
            'Success',
            'The campaign is updated.'
          );
          this._setAllCampaigns();
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'Campaign Updating Error...',
            ErrorFrontService.getErrorKey(err.error)
          );
          this._selectCampaign = null;
          console.error(err);
        }
      );
  }

  /***
   * clicks on the Update stats button
   * @param event
   * @param campaign
   * @param index
   */
  public onUpdateStats(event: Event, campaign: Campaign, index: number) {
    event.preventDefault();
    this._campaignService
      .updateStats(campaign._id)
      .pipe(first())
      .subscribe(
        (updatedCampaign: Campaign) => {
          this._campaigns[index] = updatedCampaign;
          this._translateNotificationsService.success(
            'Success',
            'The campaign stats is updated.'
          );
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'Campaign Stats Error...',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public closeModal(event: Event) {
    event.preventDefault();
    this._activateModal = false;
  }

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
   * clicks on the Confirm button of to Delete modal.
   */
  public onConfirmDelete() {
    this._campaignService
      .remove(this._selectCampaign._id)
      .pipe(first())
      .subscribe(
        () => {
          this._campaigns = this._campaigns.filter(
            (c) => c._id !== this._selectCampaign._id
          );
          this._selectCampaign = null;
          this._setAllCampaigns();
          this._translateNotificationsService.success(
            'Success',
            'The campaign is deleted.'
          );
          this._activateModal = false;
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'Campaign Deleting Error...',
            ErrorFrontService.getErrorKey(err.error)
          );
          this._selectCampaign = null;
          console.error(err);
        }
      );
  }

  public stats(campaign: Campaign, type: string): number {
    return (
      (campaign &&
        campaign.stats &&
        campaign.stats.campaign &&
        campaign.stats.campaign[type]) ||
      0
    );
  }

  public quizURL(lang: string, campaign: Campaign) {
    return QuizService.quizUrl(campaign._id, this._innovation.quizId, lang);
  }

  public copyQuizLink(lang: string, campaign: Campaign) {
    this._commonService.copyToClipboard(this.quizURL(lang, campaign));
    this._translateNotificationsService.success(
      'Success',
      'The quiz url has been copied to clipboard.'
    );
  }

  get campaigns(): Array<Campaign> {
    return this._campaigns;
  }

  set activateModal(value: boolean) {
    this._activateModal = value;
  }

  get activateModal(): boolean {
    return this._activateModal;
  }

  set sidebarValue(value: UmiusSidebarInterface) {
    this._sidebarValue = value;
  }

  get sidebarValue(): UmiusSidebarInterface {
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

  get isAddingCampaign(): boolean {
    return this._isAddingCampaign;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
