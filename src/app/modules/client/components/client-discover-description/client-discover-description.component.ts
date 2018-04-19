import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InnovationService } from '../../../../services/innovation/innovation.service';

import { InnovCard } from '../../../../models/innov-card';

import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-client-discover-description',
  templateUrl: './client-discover-description.component.html',
  styleUrls: ['./client-discover-description.component.scss']
})

export class ClientDiscoverDescriptionComponent implements OnInit {

  private _innovationCard: InnovCard[] = [];
  private quizURL: string;

  constructor(private _innovationService: InnovationService,
              private _activatedRoute: ActivatedRoute)
  {
    this._activatedRoute.params.subscribe(params => {
      this.loadInnovation(params['id'], params['lang']);
    });
  }

  ngOnInit() {}

  loadInnovation(id: any, lang: any) {

    this._innovationService.get(id).subscribe( response => {

      this.quizURL = environment.quizUrl + '/quiz/' + response.quizId + '/' + response.campaigns[0].id + '?lang=' + lang;

      const innovationCardIndex = response.innovationCards.findIndex( card => card.lang === lang);

      this._innovationCard.push(response.innovationCards[innovationCardIndex]);

    });

  }

  get innovationCard(): InnovCard[] {
    return this._innovationCard;
  }

}
