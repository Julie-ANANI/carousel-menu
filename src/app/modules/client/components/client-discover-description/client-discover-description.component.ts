import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InnovationService } from '../../../../services/innovation/innovation.service';

import { InnovCard } from '../../../../models/innov-card';

@Component({
  selector: 'app-client-discover-description',
  templateUrl: './client-discover-description.component.html',
  styleUrls: ['./client-discover-description.component.scss']
})

export class ClientDiscoverDescriptionComponent implements OnInit {

  private _innovationCard: InnovCard[] = [];

  constructor(private _innovationService: InnovationService,
              private _activatedRoute: ActivatedRoute) {
                this._activatedRoute.params.subscribe(params => {
                this.loadInnovation(params['id']);
                });
  }

  ngOnInit() {}

  loadInnovation(id: any) {
    this._innovationService.getInnovationCard(id).subscribe(result => {
      this._innovationCard.push(result);
    });
  }

  get innovationCard(): InnovCard[] {
    return this._innovationCard;
  }

  set innovationCard(value: InnovCard[]) {
    this._innovationCard = value;
  }

}
