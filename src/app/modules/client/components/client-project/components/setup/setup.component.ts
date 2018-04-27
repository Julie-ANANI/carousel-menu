import { Component, Input, OnInit } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';

@Component({
  selector: 'app-client-setup-project',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})
export class SetupProjectComponent implements OnInit {

  @Input() project: Innovation;

  private _currentTab: string;

  constructor() {}

  ngOnInit() {
    this._currentTab = 'pitch';
  }

  get currentTab() { return this._currentTab; }
  set currentTab(value: string) { this._currentTab = value; }

}
