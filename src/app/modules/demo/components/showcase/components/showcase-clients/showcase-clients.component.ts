import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Clearbit } from '../../../../../../models/clearbit';
import { TagStats } from '../../../../../../models/tag-stats';
import { AuthService } from '../../../../../../services/auth/auth.service';

@Component({
  selector: 'app-showcase-clients[tagsStats]',
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
            }, {} as {[c: string]: Clearbit});

          this._totalClients = Object.keys(companies).map((k) => companies[k]);

          this._totalClients = this._totalClients.sort((a, b) => {
            if (a.logo && !b.logo) { return -1; }
            if (!a.logo && b.logo) { return 1; }
            return 0;
          });

          const staticClients = value.every((t) => t.static);
          if (!staticClients) {
            this._selectedClients =
              Object
                .keys(companies)
                .reduce((acc, company) => {
                  acc[company] = true;
                  return acc;
                }, {} as {[clientName: string]: boolean});

            this.topClientsChange.emit(this._totalClients);
          } else {
            this._selectedClients = this.topClients.reduce((acc, client) => {
                acc[client.name] = true;
                return acc;
              }, {} as {[clientName: string]: true});
          }

        }

      });

    }

  }

  @Input() topClients: Array<Clearbit> = [];
  @Output() topClientsChange: EventEmitter<Array<Clearbit>> = new EventEmitter<Array<Clearbit>>();

  private _totalClients: Array<Clearbit> = [];

  private _modalShow = false;

  private _selectedClients: {[clientName: string]: boolean} = {};

  constructor(private _innovationService: InnovationService,
              private _authService: AuthService) {}

  public onChangeClient(event: Event, client: Clearbit): void {
    event.preventDefault();
    this._selectedClients[client.name] = !this._selectedClients[client.name];
  }

  public onClickApply(event: Event): void {
    event.preventDefault();
    const clients = this._totalClients.filter((client) => this._selectedClients[client.name]);
    this.topClientsChange.emit(clients);
    this._modalShow = false;
  }

  public openModal(event: Event) {
    event.preventDefault();
    this._modalShow = true;
  }

  get isAdmin(): boolean {
    return this._authService.isAdmin;
  }

  get totalClients(): Array<Clearbit> {
    return this._totalClients;
  }

  get modalShow(): boolean {
    return this._modalShow;
  }

  set modalShow(value: boolean) {
    this._modalShow = value;
  }

  get selectedClients(): {[clientName: string]: boolean} {
    return this._selectedClients;
  }

}
