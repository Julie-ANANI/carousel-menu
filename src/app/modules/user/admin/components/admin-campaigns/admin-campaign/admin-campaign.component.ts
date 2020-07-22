import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Campaign} from '../../../../../../models/campaign';
import {TranslateTitleService} from "../../../../../../services/title/title.service";
import {RolesFrontService} from "../../../../../../services/roles/roles-front.service";

@Component({
  templateUrl: './admin-campaign.component.html',
  styleUrls: ['./admin-campaign.component.scss']
})

export class AdminCampaignComponent implements OnInit {

  private _campaign: Campaign = <Campaign>{};

  private _tabs: Array<{key: string, name: string, route: string}> = [
    {key: 'search', name: 'Search', route: 'search'},
    {key: 'history', name: 'History', route: 'history'},
    {key: 'pros', name: 'Pros', route: 'pros'},
    {key: 'workflows', name: 'Workflows', route: 'workflows'},
    {key: 'batch', name: 'Batch', route: 'batch'},
    {key: 'answers', name: 'Answers', route: 'answers'}
  ];

  private _heading = AdminCampaignComponent._initHeading('answers');

  private _isLoading = true;

  private _fetchingError = false;

  constructor(private _activatedRoute: ActivatedRoute,
              private _rolesFrontService: RolesFrontService,
              private _translateTitleService: TranslateTitleService) {

    this._setPageTitle();
  }

  ngOnInit() {
    if (this._activatedRoute.snapshot.data['campaign']
      && typeof this._activatedRoute.snapshot.data['campaign'] !== undefined) {
      this._campaign = this._activatedRoute.snapshot.data['campaign'];
      this._isLoading = false;
      this._setPageTitle('Answers', this._campaign && this._campaign.title);

      if (this._campaign && this._campaign.stats) {
        this._campaign.stats.nbPros = this._campaign.stats.campaign && this._campaign.stats.campaign.nbProfessionals || 0;
        if (this._campaign.stats.mail) {
          this._campaign.stats.nbProsSent = this._campaign.stats.mail['totalPros'] || 0;
          this._campaign.stats.nbTotalMails = this._campaign.stats.mail['totalMails'] || 0;
          if (this._campaign.stats.mail['statuses']) {
            this._campaign.stats.nbProsReceived = this._campaign.stats.mail['statuses']['delivered'] || 0;
            this._campaign.stats.nbProsOpened = this._campaign.stats.mail['statuses']['opened'] || 0;
            this._campaign.stats.nbProsClicked = this._campaign.stats.mail['statuses']['clicked'] || 0;
          }
        }
      }

    } else {
      this._isLoading = false;
      this._fetchingError = true;
    }
  }

  private _setPageTitle(route?: string, title?: string) {
    if (title && route) {
      this._translateTitleService.setTitle( route + ' | ' + title + ' | Campaign');
    } else {
      this._translateTitleService.setTitle('Answers | Campaign');
    }
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project', 'campaigns', 'campaign'];
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(_default);
    }
  }

  private static _initHeading(value: string): string {
    switch (value) {

      case 'search' || 'history':
        return 'Search';

      case 'batch':
        return 'Batch';

      case 'history':
        return 'Search';

      case 'workflows':
        return 'Workflows';

      case 'answers':
        return 'Insights';

      case 'pros':
        return 'Insights';
    }
  }

  public onClickTab(event: Event, key: string, name: string) {
    event.preventDefault();
    this._heading = AdminCampaignComponent._initHeading(key);
    this._setPageTitle(name, this._campaign.title);
  }

  get campaign(): Campaign {
    return this._campaign;
  }

  get heading(): string {
    return this._heading;
  }

  get tabs(): Array<{key: string, name: string, route: string}> {
    return this._tabs;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

}
