import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';

@Component({
  templateUrl: './admin-campaign.component.html',
})

export class AdminCampaignComponent implements OnInit {

  constructor(private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _rolesFrontService: RolesFrontService,
              private _translateTitleService: TranslateTitleService) {

    this._initHeading();
    this._setPageTitle();
  }

  get campaign(): Campaign {
    return this._campaign;
  }

  get heading(): string {
    return this._heading;
  }

  get tabs(): Array<{ key: string, name: string, route: string }> {
    return this._tabs;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  private _campaign: Campaign = <Campaign>{};

  private _tabs: Array<{ key: string, name: string, route: string }> = [
    {key: 'search', name: 'Search', route: 'search'},
    {key: 'history', name: 'History', route: 'history'},
    {key: 'pros', name: 'Pros', route: 'pros'},
    {key: 'workflows', name: 'Workflows', route: 'workflows'},
    {key: 'batch', name: 'Batch', route: 'batch'},
    {key: 'answers', name: 'Answers', route: 'answers'}
  ];

  private _heading = '';

  private _isLoading = true;

  private _fetchingError = false;

  private static _initHeading(value: string): string {
    switch (value) {

      case 'search':
      case 'history':
        return 'Search';

      case 'batch':
        return 'Batch';

      case 'workflows':
        return 'Workflows';

      case 'answers':
      case 'pros':
        return 'Insights';

    }
  }

  ngOnInit() {
    if (this._activatedRoute.snapshot.data['campaign']
      && typeof this._activatedRoute.snapshot.data['campaign'] !== undefined) {
      this._campaign = this._activatedRoute.snapshot.data['campaign'];
      this._isLoading = false;
      this._setPageTitle();

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

  private _initHeading() {
    const _url = this._router.routerState.snapshot.url.split('/');
    if (_url.length === 7) {
      const _params = _url[6].indexOf('?');
      const _value = _params > 0 ? _url[6].substring(0, _params) : _url[6];
      this._heading = AdminCampaignComponent._initHeading(_value);
    } else {
      this._heading = AdminCampaignComponent._initHeading('answers');
    }
  }

  private _setPageTitle() {
    if (this._campaign && this._campaign.title) {
      this._translateTitleService.setTitle(this._heading + ' | ' + this._campaign.title + ' | Campaign');
    } else {
      this._translateTitleService.setTitle(this._heading + ' | Campaign');
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

  public backToCampaigns(): string {
    return `/user/admin/projects/project/${this._campaign.innovation && this._campaign.innovation._id}/campaigns`;
  }

  public onClickTab(event: Event, key: string) {
    event.preventDefault();
    this._heading = AdminCampaignComponent._initHeading(key);
    this._setPageTitle();
  }

}
