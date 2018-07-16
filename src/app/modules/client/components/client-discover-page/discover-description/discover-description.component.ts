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
  private quizButtonDisplay: string;

  constructor(private innovationService: InnovationService,
              private activatedRoute: ActivatedRoute,
              private shareService: ShareService,
              private domSanitizer1: DomSanitizer) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.loadInnovation(params['id'], params['lang']);
    });
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

      const innovationCardIndex = response.innovationCards.findIndex( card => card.lang === lang);

      this._innovationCard.push(response.innovationCards[innovationCardIndex]);

    });

  }

  get innovationCard(): InnovCard[] {
    return this._innovationCard;
  }

  get domSanitizer() {
    return this.domSanitizer1;
  }

}
