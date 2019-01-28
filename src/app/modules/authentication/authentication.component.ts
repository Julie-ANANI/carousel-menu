import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'authenticator',
  templateUrl: './authentication.component.html',
})

export class AuthenticationComponent implements OnInit {

  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _authService: AuthService) {
    console.trace("In the constructor");
  }

  ngOnInit(): void {
    console.log("I'm in the on init");
    let whereToGo = null;
    this._activatedRoute.queryParams.subscribe(result=>{
      console.log(`Activated route: ${this._activatedRoute}`);
      if(result['code']) {
        console.trace("Trying to recover the linkedin code");
        this._authService.linkedInFetchToken(result['code'], environment.domain)
          .subscribe(result=>{
            console.trace("Good, we have everything and we may be authenticated");
            console.log(JSON.stringify(result));
            this._router.navigate(['/project']).then(_=>{console.log("OK")}, err=>{console.error(err)});
          }, err=>{
            console.error(err);
            this._router.navigate(['/login']).then(_=>{console.log("OK")}, err=>{console.error(err)});;
          });
        //This is the first call
      } else if(result['error']) {
        //Something wrong happened
        console.error(result['error_description']);
        whereToGo = this._router.navigate(['/login']);
      } else if(result['access_token']) {
        //This is the second one, authenticate in the API
        console.trace("What??");
        whereToGo =  this._router.navigate(['/login']);
      } else {
        //There's some error...
        console.error(result['error_description'])
        whereToGo = this._router.navigate(['/login']);
      }
      if(whereToGo) {
        whereToGo.then(_=>{console.log("OK")}, err=>{console.error(err)});
      }
    }, err=>{
      console.error(err);
      this._router.navigate(['/login']).then(_=>{console.log("OK")}, err=>{console.error(err)});
    });
  }
}