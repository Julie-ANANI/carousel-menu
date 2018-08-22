import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { InnovCard} from '../../../../../models/innov-card';
import { Innovation } from '../../../../../models/innovation';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { ShareService } from '../../../../../services/share/share.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-discover-description',
  templateUrl: './discover-description.component.html',
  styleUrls: ['./discover-description.component.scss']
})

export class DiscoverDescriptionComponent implements OnInit {

  private _innovationCard: InnovCard[] = [];
  private innovation: Innovation;
  private quizUrl: string;
  private linkedInUrl: string;
  private twitterUrl: string;
  private facebookUrl: string;
  private googlePlusUrl: string;
  private mailUrl: string;
  private quizButtonDisplay: string;
  private _mediaModal: boolean;
  private _mediaURL: string;
  private _lang: string;
  private _id: string;

  constructor(private innovationService: InnovationService,
              private activatedRoute: ActivatedRoute,
              private shareService: ShareService,
              private domSanitizer1: DomSanitizer) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this._lang = params.lang;
    });

    this.activatedRoute.params.subscribe(params => {
      this._id = params['id'];
    });

    this.loadInnovation(this._id, this._lang);

  }

  loadInnovation(id: any, lang: any) {

    this.innovationService.get(id).subscribe(response => {

      if (response.quizId === '') {
        this.quizButtonDisplay = 'none';
      }

      if (response.campaigns.length !== 0) {
        this.quizUrl = environment.quizUrl + '/quiz/' + response.quizId + '/' + response.campaigns[0].id + '?lang=' + lang;
      }

      this.innovation = response;

      this.linkedInUrl = this.shareService.linkedinProjectShareLink(this.innovation, lang);

      this.linkedInUrl = this.shareService.linkedinProjectShareLink(this.innovation, lang);

      this.twitterUrl = this.shareService.twitterProjectShareLink(this.innovation, lang);

      this.facebookUrl = this.shareService.facebookProjectShareLink(this.innovation);

      this.googlePlusUrl = this.shareService.googleProjectShareLink(this.innovation, lang);

      this.mailUrl = this.shareService.mailProjectShareLink(this.innovation, lang);

      const innovationCardIndex = response.innovationCards.findIndex( card => card.lang === lang);

      this._innovationCard.push(response.innovationCards[innovationCardIndex]);

    });

  }

  mediaToShow(event: Event, src: string) {
    event.preventDefault();
    this._mediaModal = true;
    this._mediaURL = src;
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._mediaModal = false;
  }

  get lang(): string {
    return this._lang;
  }

  get id(): string {
    return this._id;
  }

  get innovationCard(): InnovCard[] {
    return this._innovationCard;
  }

  get domSanitizer() {
    return this.domSanitizer1;
  }

  get mediaModal(): boolean {
    return this._mediaModal;
  }

  get mediaURL(): string {
    return this._mediaURL;
  }

}
