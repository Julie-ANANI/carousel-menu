import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  public nbProjectsToValidate = 87;
  public nbProjectsToCheck = 124;
  public nbProjectsToFind = 412;



  constructor(private _titleService: Title) { }

  ngOnInit(): void {
    this._titleService.setTitle('Admin Dashboard');
  }

}
