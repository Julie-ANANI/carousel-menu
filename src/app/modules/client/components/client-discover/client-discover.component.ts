import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'app-client-discover',
  templateUrl: './client-discover.component.html',
  styleUrls: ['./client-discover.component.scss']
})
export class ClientDiscoverComponent implements OnInit {

  constructor(private _titleService: Title) {}

  ngOnInit(): void {
    this._titleService.setTitle('Découvrez nos dernières innovations'); // TODO translate
  }

}
