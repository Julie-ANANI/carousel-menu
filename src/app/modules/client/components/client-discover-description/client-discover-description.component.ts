import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-discover-description',
  templateUrl: './client-discover-description.component.html',
  styleUrls: ['./client-discover-description.component.scss']
})
export class ClientDiscoverDescriptionComponent implements OnInit {

  constructor(private _activatedRoute: ActivatedRoute) {
    this._activatedRoute.params.subscribe(params => console.log (params));
  }

  ngOnInit() {
  }

}
