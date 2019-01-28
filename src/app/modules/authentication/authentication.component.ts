import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
//import { environment } from "../../../environments/environment";

@Component({
  selector: 'authenticator',
  templateUrl: './authentication.component.html',
})

export class AuthenticationComponent implements OnInit {

  constructor(private _router: Router,
              private _authService: AuthService) {
  }

  ngOnInit(): void {
    // Try to update the auth service!
    this._authService.initializeSession()
      .subscribe(result=>{
        if(this._authService.isAuthenticated) {
          return this._router.navigate(['/user/projects']);
        } else {
          console.error("There's an authentication problem.");
          return this._router.navigate(['/login']);
        }
      }, err=>{
        console.error(`There's an authentication problem: ${err}`);
        return this._router.navigate(['/login']);
      });
  }
}
