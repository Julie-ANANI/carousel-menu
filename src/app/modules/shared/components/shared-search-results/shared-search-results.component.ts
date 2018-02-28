import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign } from '../../../../models/campaign';
import { SearchService } from '../../../../services/search/search.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { DownloadService } from '../../../../services/download/download.service';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-shared-search-results',
  templateUrl: './shared-search-results.component.html',
  styleUrls: ['./shared-search-results.component.scss']
})
export class SharedSearchResultsComponent implements OnInit {

  @Input() public campaign: Campaign;

  private _request: any;
  private _selection: any;
  private _chosenCampaign: Array<Campaign>;
  public addToCampaignModal: boolean = false;
  public config: any = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    },
  };

  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _authService: AuthService,
              private _searchService: SearchService,
              private _downloadService: DownloadService,
              private _notificationsService: TranslateNotificationsService,
              private _professionalsService: ProfessionalsService) {}

  ngOnInit(): void {
    this._request = this._activatedRoute.snapshot.data['request'];
    if (this.campaign) {
      this.campaign.name = this.campaign.title;
      this.chosenCampaign = [this.campaign];
    }
  }

  public buildImageUrl(country: string): string {
    if (country) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }

  updateSelection(value: any) {
    this._selection = value;
  }
  searchMails() {
    const params: any = {
      user: this._authService.getUserInfo(),
      query: {
        motherRequestId: this._request._id
      }
    };
    if (this._selection.pros != 'all') {
      const prosWithoutEmail = this._selection.pros.map((person: any) => {
        return {
          id: person._id,
          requestId: this._request._id,
          email: person.email || ''
        };
      }).filter((p: any) => p.email === '');
      params.persons = prosWithoutEmail;
    } else {
      params.all = true;
      params.requestId = this._request._id;
      params.query = this._selection.query;
      params.query.motherRequestId = this._request._id;
      //FIXME: pour différencier l'ancienne interface de la nouvelle, à supprimer quand on supprime la vieille interface
      params.query.newInterface = true;
    }
    if (this._request.country) {
      params.country = this._request.country;
    }
    this._searchService.searchMails(params).first().subscribe(result => {
      console.log(result);
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
      keywords: this._request.keywords[0].original
    };
    if (this._selection.pros != 'all') {
      const prosWithEmail = this._selection.pros.filter((p: any) => p.email);
      params.professionals = prosWithEmail;
    } else {
      params.all = true;
      params.query = this._selection.query;
      params.query.motherRequestId = this._request._id;
      //FIXME: pour différencier l'ancienne interface de la nouvelle, à supprimer quand on supprime la vieille interface
      params.query.newInterface = true;
    }
    this._professionalsService.addFromRequest(params).first().subscribe(result => {
      this._notificationsService.success('Déplacement des pros', `${result.nbProfessionalsMoved} pros ont été déplacés`);
      if (goToCampaign) {
        this._router.navigate([`/admin/campaigns/campaign/${campaign._id}/pros`]);
      }
    });
  }

  exportProsCSV() {
    const params: any = {
      user: this._authService.getUserInfo(),
      requestId: this._request._id
    };
    if (this._selection.pros != 'all') {
      params.persons = this._selection.pros;
    } else {
      params.all = true;
      params.requestId = this._request._id;
      params.query = this._selection.query;
      params.query.motherRequestId = this._request._id;
      //FIXME: pour différencier l'ancienne interface de la nouvelle, à supprimer quand on supprime la vieille interface
      params.query.newInterface = true;
    }

    this._searchService.export(params.requestId, params).first().subscribe((result: any) => {
      this._downloadService.saveCsv(result.csv, this.request.keywords[0].original);
    });
  }
  get totalSelected () { return this._selection && this._selection.total || 0};
  get request() { return this._request; }
  get chosenCampaign(): Array<Campaign> { return this._chosenCampaign; }
  set chosenCampaign(value: Array<Campaign>) { this._chosenCampaign = value; }
}
