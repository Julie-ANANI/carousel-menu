import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';

@Component({
  selector: 'app-admin-libraries',
  templateUrl: './admin-libraries.component.html',
  styleUrls: ['./admin-libraries.component.scss']
})
export class AdminLibrariesComponent implements OnInit {

  private _tabs: Array<string> = ['workflows', 'signatures'];

  constructor(private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle("Libraries");
  }

  public get tabs(): Array<string> { return this._tabs; }
}
