import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';

@Component({
  selector: 'app-admin-project-cards',
  templateUrl: 'admin-project-cards.component.html',
  styleUrls: ['admin-project-cards.component.scss']
})
export class AdminProjectCardsComponent implements OnInit {

  private _project: Innovation;

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
  }
  
  get project() { return this._project; }
}
