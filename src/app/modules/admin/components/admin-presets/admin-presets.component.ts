import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-presets',
  templateUrl: './admin-presets.component.html',
  styleUrls: ['./admin-presets.component.scss']
})
export class AdminPresetsComponent implements OnInit {

  private _currentPage = 'presets';

  constructor(private _router: Router) {}

  ngOnInit(): void {
    const url = this._router.routerState.snapshot.url.split('/');
    this._currentPage = url ? url[2] || 'presets' : 'presets';
  }

  get currentPage() { return this._currentPage; }
}
