import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
  }

  public canShow(reqLevel: number): boolean {
    return reqLevel && (this._authService.adminLevel & reqLevel) === reqLevel;
  }

}
