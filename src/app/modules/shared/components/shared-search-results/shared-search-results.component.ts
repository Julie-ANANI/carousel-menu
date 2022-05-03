import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign } from '../../../../models/campaign';
import { SearchService } from '../../../../services/search/search.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { DownloadService } from '../../../../services/download/download.service';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../services/translate-notifications/translate-notifications.service';
import { UmiusConfigInterface } from '@umius/umi-common-component';

@Component({
  selector: 'app-shared-search-results',
  templateUrl: './shared-search-results.component.html',
  styleUrls: ['./shared-search-results.component.scss']
})
export class SharedSearchResultsComponent implements OnInit {

  @Input() public campaign: Campaign;

  private _request: any;
  private _selection: any;
  private _chosenCampaign: Array<any>;
  private _addToCampaignModal = false;
  public config: UmiusConfigInterface = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }',
  };

  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _authService: AuthService,
              private _searchService: SearchService,
              private _notificationsService: TranslateNotificationsService,
              private _professionalsService: ProfessionalsService) {
  }

  ngOnInit(): void {
    if (this._activatedRoute.snapshot.data['request']) {
      this._request = this._activatedRoute.snapshot.data['request'];
      this._request.keywords = this._request.keywords || this._request.oldKeywords[0].original;
      if (this.campaign) {
        const chosenCampaign = {
          _id: this.campaign._id,
          name: this.campaign.title,
          innovation: this.campaign.innovation._id
        };
        this.chosenCampaign = [chosenCampaign];
      } else {
        this.chosenCampaign = [];
      }
    }
  }

  updateSelection(value: any) {
    this._selection = value;
  }

  searchMails() {
    const params: any = {
      requestId: this._request._id,
      user: this._authService.getUserInfo(),
      query: {
        motherRequestId: this._request._id
      }
    };
    if (this._selection.pros !== 'all') {
      const prosWithoutEmail = this._selection.pros.map((person: any) => {
        person.id = person._id;
        person.requestId = this._request._id;
        person.email = person.email || "";
        return person;
      }).filter((p: any) => p.email === '');
      params.persons = prosWithoutEmail;
    } else {
      params.all = true;
      params.query = this._selection.query;
      params.query.motherRequestId = this._request._id;
    }
    if (this._request.country) {
      params.country = this._request.country;
    }
    this._searchService.searchMails(params).subscribe((result: any) => {
      this._notificationsService.success('Recherche lancée', `La recherche de mails a été lancée`);
    });
  }

  updateCampaign(event: any) {
    this._chosenCampaign = event.value;
  }

  addToCampaign(campaigns: Array<Campaign>, goToCampaign?: boolean) {
    this.addToCampaignModal = false;
    const campaign = campaigns[0];
    const params: any = {
      newCampaignId: campaign._id,
      newInnovationId: campaign.innovation,
      requestId: this._request._id,
      keywords: this._request.keywords
    };
    if (this._selection.pros !== 'all') {
      const prosWithEmail = this._selection.pros.filter((p: any) => p.email);
      params.professionals = prosWithEmail;
    } else {
      params.all = true;
      params.query = this._selection.query;
      params.query.motherRequestId = this._request._id;
    }
    this._professionalsService.addFromRequest(params).subscribe((result: any) => {
      this._notificationsService.success('Déplacement des pros', `${result.nbProfessionalsMoved} pros ont été déplacés`);
      if (goToCampaign) {
        this._router.navigate([`/user/admin/campaigns/campaign/${campaign._id}/pros`]);
      }
    });
  }

  exportProsCSV() {
    const params: any = {
      user: this._authService.getUserInfo(),
      requestId: this._request._id
    };
    if (this._selection.pros !== 'all') {
      params.persons = this._selection.pros;
    } else {
      params.all = true;
      params.requestId = this._request._id;
      params.query = this._selection.query;
      params.query.motherRequestId = this._request._id;
    }

    this._searchService.export(params.requestId, params).subscribe((result: any) => {
      DownloadService.saveCsv(result.csv, this.request.keywords);
    });
  }

  get totalSelected() {
    return this._selection && this._selection.total || 0
  };

  get request() {
    return this._request;
  }

  get chosenCampaign(): Array<any> {
    return this._chosenCampaign;
  }

  set chosenCampaign(value: Array<any>) {
    this._chosenCampaign = value;
  }

  get addToCampaignModal() {
    return this._addToCampaignModal;
  }

  set addToCampaignModal(value: boolean) {
    this._addToCampaignModal = value;
  }
}
