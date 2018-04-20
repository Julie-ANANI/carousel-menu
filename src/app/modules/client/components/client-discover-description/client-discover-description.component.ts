import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InnovationService } from '../../../../services/innovation/innovation.service';
import { ShareService } from '../../../../services/share/share.service';

import { InnovCard } from '../../../../models/innov-card';

import { environment } from '../../../../../environments/environment';
import {Innovation} from '../../../../models/innovation';

@Component({
  selector: 'app-client-discover-description',
  templateUrl: './client-discover-description.component.html',
  styleUrls: ['./client-discover-description.component.scss']
})

export class ClientDiscoverDescriptionComponent implements OnInit {

  private _innovationCard: InnovCard[] = [];
  private innovation: Innovation;
  private quizUrl: string;
  private linkedInUrl: string;
  private twitterUrl: string;
  private facebookUrl: string;
  private googlePlusUrl: string;
  private quizButtonDisplay: string

  constructor(private _innovationService: InnovationService,
              private _activatedRoute: ActivatedRoute,
              private _shareService: ShareService)
  {
    this._activatedRoute.params.subscribe(params => {
      this.loadInnovation(params['id'], params['lang']);

    });
  }

  ngOnInit() {}

  loadInnovation(id: any, lang: any) {

    this._innovationService.get(id).subscribe( response => {

      if (response.quizId === '') {
        this.quizButtonDisplay = 'none';
      }

      this.quizUrl = environment.quizUrl + '/quiz/' + response.quizId + '/' + response.campaigns[0].id + '?lang=' + lang;

      this.innovation = response;

      console.log(this.innovation);

      this.linkedInUrl = this._shareService.linkedinProjectShareLink(this.innovation, lang);

      this.twitterUrl = this._shareService.twitterProjectShareLink(this.innovation, lang);

      this.facebookUrl = this._shareService.facebookProjectShareLink(this.innovation);

      this.googlePlusUrl = this._shareService.googleProjectShareLink(this.innovation, lang);

      const innovationCardIndex = response.innovationCards.findIndex( card => card.lang === lang);

      this._innovationCard.push(response.innovationCards[innovationCardIndex]);

    });

  }

  get innovationCard(): InnovCard[] {
    return this._innovationCard;
  }

}
