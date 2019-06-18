import { Component, Input } from '@angular/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Clearbit } from '../../../../../../models/clearbit';
import { TagStats } from '../../../../../../models/tag-stats';
import { AuthService } from '../../../../../../services/auth/auth.service';

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
            }, {} as {[c: string]: Clearbit});

          this._totalClients = Object.keys(companies).map((k) => companies[k]);

          this._totalClients = this._totalClients.sort((a, b) => {
            if (a.logo && !b.logo) { return -1; }
            if (!a.logo && b.logo) { return 1; }
            return 0;
          });

          this._selectedClients =
            Object
              .keys(companies)
              .reduce((acc, company) => {
                acc[company] = true;
                return acc;
              }, {} as {[clientName: string]: boolean});

          this._slides = this.getSlides(this._totalClients);

        }

      });

    }

  }

  private _totalClients: Array<Clearbit> = [];

  private _currentSlideIndex = 0;

  private _modalShow = false;

  private _selectedClients: {[clientName: string]: boolean} = {};

  private _slides: Array<Array<Clearbit>>;

  constructor(private _innovationService: InnovationService,
              private _authService: AuthService) {}

  private getSlides(clients: Array<Clearbit>, chunkSize: number = 6): Array<Array<Clearbit>> {
    const slides = [];
    const nbSlides = Math.ceil(clients.length / chunkSize);
    for (let i = 0; i < nbSlides ; i++) {
      slides.push(clients.slice( chunkSize * i, (chunkSize * i) + chunkSize));
    }
    return slides;
  }

  public onChangeClient(event: Event, client: Clearbit): void {
    event.preventDefault();
    this._selectedClients[client.name] = (event.target as HTMLInputElement).checked;
  }

  public onClickApply(event: Event): void {
    event.preventDefault();
    this._slides = this.getSlides(this._totalClients.filter((client) => this._selectedClients[client.name]));
  }

  public onClickNav(event: Event, index: number): void {
    this._currentSlideIndex = index;
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

  get slides(): Array<Array<Clearbit>> {
    return this._slides;
  }

  get modalShow(): boolean {
    return this._modalShow;
  }

  set modalShow(value: boolean) {
    this._modalShow = value;
  }

  get currentSlideIndex(): number {
    return this._currentSlideIndex;
  }

  get selectedClients(): {[clientName: string]: boolean} {
    return this._selectedClients;
  }

}
