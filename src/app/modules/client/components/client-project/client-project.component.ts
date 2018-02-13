import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../models/innovation';

@Component({
  selector: 'app-client-project',
  templateUrl: './client-project.component.html',
  styleUrls: ['./client-project.component.scss']
})
export class ClientProjectComponent implements OnInit {

  @Input() project: Innovation;

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (!this.project) {
      this.project = this._activatedRoute.snapshot.data['innovation'];
    }
  }
}
