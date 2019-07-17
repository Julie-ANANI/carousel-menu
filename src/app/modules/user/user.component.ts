import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { LoaderService } from '../../services/loader/loader.service';
//import {SwellrtBackend} from "../swellrt-client/services/swellrt-backend";
//import {UserService} from "../../services/user/user.service";

//declare let swellrt;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

  private _displayLoader: boolean = true;

  private _adminSide: boolean;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _location: Location,
              // private _userService: UserService,
              // private _swellRTBackend: SwellrtBackend,
              private _loaderService: LoaderService,
              private _router: Router) {

    if (isPlatformBrowser(this._platformId)) {

      this._router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this._displayLoader = true;
        } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          this._adminSide = this._location.path().slice(5, 11) === '/admin';
        }
      });

      this._loaderService.isLoading$.subscribe((loading: boolean) => {
        setTimeout(() => {
          this._displayLoader = loading;
        })
      });
    }

  }

  ngOnInit() {
    this._adminSide = this._location.path().slice(5, 11) === '/admin';
    /*this.startSwellRTClient();
    this.startSwellRTSession();*/
  }

  /*private startSwellRTSession() {
    this._userService.getSelf().subscribe(user=>{
      this._swellRTBackend.startSwellRTSession(user)
        .then(result=>{
          //TODO add some notification? maybe?
          console.log(`The session for ${result.id} has been started`);
        }, err=>{
          console.error(`The session for user ${user.id} couldn't be started! ${err}`);
        });
    }, err=>{
      console.error(`The session for user couldn't be started! ${err}`);
    });
  }

  private startSwellRTClient() {
    // Try to start the swellrt client
    this._swellRTBackend.bind(new Promise(
      (resolve, reject) => {
        let connected = false;
        swellrt.onReady(server=>{
          console.log('The swellrt client is ready!');
          connected = true;
          resolve(server);
        });

        //Put a timeout for the connection
        setTimeout(()=>{
          if(!connected) {
            const msg = "Connection to swellrt server timed out (15s)";
            console.error(msg);
            reject(msg);
          }
        }, 15000);
      }
    ));
  }*/

  get displayLoader(): boolean {
    return this._displayLoader;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

}
