import { Component, Input } from '@angular/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Clearbit } from '../../../../../../models/clearbit';
import { TagStats } from '../../../../../../models/tag-stats';
import { AuthService } from '../../../../../../services/auth/auth.service';


export interface Slide {
  clients?: Array<Clearbit>;
}


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

          this._totalClients = this._totalClients.sort((a, b) => {
            if (a.logo && !b.logo) { return -1; }
            if (!a.logo && b.logo) { return 1; }
            return 0;
          });

          /*this._selectedClients = this._totalClients.sort((a, b) => {
            if (a.logo && !b.logo) { return -1; }
            if (!a.logo && b.logo) { return 1; }
            return 0;
          });*/

          this._getSlides();

          //console.log(this._totalClients.length);

          //this._topClients = this._selectedClients;

        }

      });

    } else {
      //this._topClients = [];
    }

  }

  //private _topClients: Array<Clearbit> = [];

  //private _selectedClients: Array<Clearbit> = [];

  private readonly _adminPass: boolean = false;

  private _totalClients: Array<Clearbit> = [];

  //private _modalShow: boolean = false;

  currentSlideIndex: number = 0;

  private _slides: Array<Slide>;

  constructor(private _innovationService: InnovationService,
              private _authService: AuthService) {

    this._adminPass = this._authService.adminLevel > 2;

  }

  private _getSlides() {

    this._slides = [];

    if (this._totalClients.length === 0 || this._totalClients.length <=6) {
      this._slides.push({ clients: this._totalClients.slice(0, 6) });
    } else {
      const slide = Math.ceil(this._totalClients.length / 6);

      for (let i = 0; i < slide ; i++) {
        if ( i === 0) {
          this._slides.push({clients: this._totalClients.slice(0, 6)});
        } else {
          this._slides.push({ clients: this._totalClients.slice( 6 * i, (6 * i) + 6) });
        }
      }

    }

  }

  public onClickNav(event: Event, index: number) {
    this.currentSlideIndex = index;
  }


  /*public openModal(event: Event) {
    event.preventDefault();
    this._modalShow = true;
  }*/


  /*public activeClient(client: Clearbit) {
    return this._selectedClients.some((item) => item === client);
  }*/


  /*public onChangeClient(event: Event, client: Clearbit) {
    if (event.target['checked']) {
      if (this._selectedClients.length < 8) {
        this._selectedClients.push(client);
      } else {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.MAX_SELECT_CLIENTS');
      }
    } else {
      this._selectedClients = this._selectedClients.filter((item) => item !== client);
    }
  }*/


  /*public onClickApply(event: Event) {
    event.preventDefault();
    this._topClients = this._selectedClients;
    this._modalShow = false;
  }*/


  /*get topClients() {
    return this._topClients;
  }*/

  get adminPass(): boolean {
    return this._adminPass;
  }

  /*get modalShow(): boolean {
    return this._modalShow;
  }*/

  /*set modalShow(value: boolean) {
    this._modalShow = value;
  }*/

  get totalClients(): Array<Clearbit> {
    return this._totalClients;
  }

  get slides(): Array<Slide> {
    return this._slides;
  }

}
