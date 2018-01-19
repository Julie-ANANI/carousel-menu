import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-project-synthesis',
  templateUrl: './client-project-synthesis.component.html',
  styleUrls: ['./client-project-synthesis.component.scss']
})
export class ClientProjectSynthesisComponent implements OnInit {

  constructor(private _activatedRoute: ActivatedRoute) { }

  private _project: any;
  
  ngOnInit() {
    this._project = this._activatedRoute.snapshot.data['innovation'];
  }

  get project(): any { return this._project; }
}
