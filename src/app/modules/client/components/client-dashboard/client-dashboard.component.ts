import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.styl']
})
export class ClientDashboardComponent implements OnInit{

  constructor(private _titleService: Title) {}

  ngOnInit(): void {
    this._titleService.setTitle('Dashboard');
  }

}
