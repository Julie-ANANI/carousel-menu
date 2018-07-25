import { Component, OnInit } from '@angular/core';
import {TranslateTitleService} from '../../../../services/title/title.service';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {
  private _tabs: Array<string> = ['blacklist', 'countries'];

  constructor(private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('Settings');
  }

  public get tabs(): Array<string> { return this._tabs; }
}
