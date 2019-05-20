import { Component, Input } from '@angular/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Clearbit } from '../../../../../../models/clearbit';
import { TagStats } from '../../../../../../models/tag-stats';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-showcase-clients',
  templateUrl: './showcase-clients.component.html',
  styleUrls: ['./showcase-clients.component.scss']
})

export class ShowcaseClientsComponent {

  @Input() set tagsStats(value: Array<TagStats>) {
    const tags_id = value.map((st) => st.tag._id);

    if (tags_id.length > 0) {
      const config = {
        fields: 'created owner',
        tags: JSON.stringify({ $in: tags_id })
      };

      this._innovationService.getAll(config).subscribe((next) => {
        if (Array.isArray(next.result)) {

          // we calculate the list of companies without duplicates
          const companies = next.result
            .filter((i) => i.owner.company && i.owner.company.name)
            .map((i) => i.owner.company)
            .reduce((acc, company) => {
              acc[company.name] = company;
              return acc;
            }, {});

          this._totalClients = Object.values(companies);
          this._selectedClients = this._totalClients.sort((a, b) => {
            if (a.logo && !b.logo) { return -1; }
            if (!a.logo && b.logo) { return 1; }
            return 0;
          }).slice(0, 8);
          this._topClients = this._selectedClients;

        }
      });

    } else {
      this._topClients = [];
    }

  }

  private _topClients: Array<Clearbit> = [];

  private _selectedClients: Array<Clearbit> = [];

  private readonly _adminPass: boolean = false;

  private _totalClients: Array<Clearbit> = [];

  private _modalShow: boolean = false;

  constructor(private _innovationService: InnovationService,
              private _authService: AuthService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._adminPass = this._authService.adminLevel > 2;

  }


  public openModal(event: Event) {
    event.preventDefault();
    this._modalShow = true;
  }


  public activeClient(client: Clearbit) {
    return this._selectedClients.some((item) => item === client);
  }


  public onChangeClient(event: Event, client: Clearbit) {
    if (event.target['checked']) {
      if (this._selectedClients.length < 8) {
        this._selectedClients.push(client);
      } else {
        this._translateNotificationsService.error('ERROR.ERROR', 'You can only select 8 clients.');
      }
    } else {
      this._selectedClients = this._selectedClients.filter((item) => item !== client);
    }
  }


  public onClickApply(event: Event) {
    event.preventDefault();
    this._topClients = this._selectedClients;
    this._modalShow = false;
  }


  get topClients() {
    return this._topClients;
  }

  get adminPass(): boolean {
    return this._adminPass;
  }

  get modalShow(): boolean {
    return this._modalShow;
  }

  set modalShow(value: boolean) {
    this._modalShow = value;
  }

  get totalClients(): Array<Clearbit> {
    return this._totalClients;
  }

}
