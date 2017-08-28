import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.styl']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private _titleService: Title) { }

  ngOnInit(): void {
    this._titleService.setTitle('Admin Dashboard'); // TODO translate
  }

}
