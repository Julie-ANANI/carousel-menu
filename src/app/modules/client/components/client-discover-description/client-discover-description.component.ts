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
  get innovationCard(): InnovCard[] {
    return this._innovationCard;
  }

  set innovationCard(value: InnovCard[]) {
    this._innovationCard = value;
  }

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
      this._innovationCard.push(response.innovationCards[0]);

    });

   /* this._innovationService.getInnovationCardByLanguage(id, lang).subscribe(response => {
     this._innovationCard.push(response);
    }); */

  }

}
