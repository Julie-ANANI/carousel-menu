import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';

@Component({
  selector: 'app-admin-project-synthesis',
  templateUrl: 'admin-project-synthesis.component.html',
  styleUrls: ['admin-project-synthesis.component.scss']
})
export class AdminProjectSynthesisComponent implements OnInit {

  private _project: Innovation;

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
  }
  
  get project() { return this._project; }
}
