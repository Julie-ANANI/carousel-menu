import { Component, Input, OnInit } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';

@Component({
  selector: 'app-client-exploration-project',
  templateUrl: 'exploration.component.html',
  styleUrls: ['exploration.component.scss']
})
export class ExplorationProjectComponent implements OnInit {

  @Input() project: Innovation;

  private _contactUrl: string;

  constructor() {}

  ngOnInit() {
    this._contactUrl = encodeURI('mailto:contact@umi.us?subject=' + this.project.name);
  }

  get contactUrl() { return this._contactUrl; }

}
