import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './admin-preset.component.html',
  styleUrls: ['./admin-preset.component.scss']
})
export class AdminPresetComponent implements OnInit {

  private _currentPage = 'preset';

  constructor(private _router: Router) {
    // override the route reuse strategy
    this._router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit(): void {
    const url = this._router.routerState.snapshot.url.split('/');
    this._currentPage = url ? url[2] || 'preset' : 'preset';
  }

  get currentPage() { return this._currentPage; }
}
