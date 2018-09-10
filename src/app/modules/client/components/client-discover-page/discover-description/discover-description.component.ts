import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { InnovCard} from '../../../../../models/innov-card';
import { Innovation } from '../../../../../models/innovation';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { ShareService } from '../../../../../services/share/share.service';
import { environment } from '../../../../../../environments/environment';
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';

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

  private _patent = false;
  private _projectState: number;

  displaySpinner = true;

  constructor(private innovationService: InnovationService,
              private activatedRoute: ActivatedRoute,
              private shareService: ShareService,
              private domSanitizer1: DomSanitizer,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this._id = params['id'];
      this._lang = params['lang'];
    });

    this.loadInnovation(this._id, this._lang);

  }

  loadInnovation(id: string, lang: string) {
    this.innovationService.get(id).subscribe(response => {

      if (response.quizId === '' || response.status === 'DONE') {
        this.quizButtonDisplay = 'none';
      }

      if (response.campaigns.length !== 0) {
        this.quizUrl = environment.quizUrl + '/quiz/' + response.quizId + '/' + response.campaigns[0].id + '?lang=' + lang;
      }

      this.innovation = response;

      this._patent = response.patented;

      this._projectState = response.projectStatus;

      this.linkedInUrl = this.shareService.linkedinProjectShareLink(this.innovation, lang);

      this.linkedInUrl = this.shareService.linkedinProjectShareLink(this.innovation, lang);

      this.twitterUrl = this.shareService.twitterProjectShareLink(this.innovation, lang);

      this.facebookUrl = this.shareService.facebookProjectShareLink(this.innovation);

      this.googlePlusUrl = this.shareService.googleProjectShareLink(this.innovation, lang);

      this.mailUrl = this.shareService.mailProjectShareLink(this.innovation, lang);

      const innovationCardIndex = response.innovationCards.findIndex( card => card.lang === lang);

      this._innovationCard.push(response.innovationCards[innovationCardIndex]);

    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'DISCOVERDESCRIPTION.ERROR');
    }, () => {
      this.displaySpinner = false;
    });

  }

  getProjectState(value: number) {
    if (value === 0) {
      return 'DISCOVERDESCRIPTION.STAGE.A'
    }

    if (value === 1) {
      return 'DISCOVERDESCRIPTION.STAGE.B'
    }

    if (value === 2) {
      return 'DISCOVERDESCRIPTION.STAGE.C'
    }

  }

  getSrc(src: string): string {
    if (src === '' ) {
      return 'https://res.cloudinary.com/umi/image/upload/v1535383716/app/default-images/image-not-available.png';
    }

    return src;
  }

  mediaToShow(event: Event, src: string) {
    event.preventDefault();
    this._mediaModal = true;
    this._mediaURL = this.getSrc(src);
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

  get patent(): boolean {
    return this._patent;
  }

  get projectState(): number {
    return this._projectState;
  }

}
