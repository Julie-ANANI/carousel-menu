import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { LoaderService } from '../../services/loader/loader.service';
import { Subject } from 'rxjs';
import { ScrollService } from '../../services/scroll/scroll.service';
import { isPlatformBrowser, Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
// import {SwellrtBackend} from "../swellrt-client/services/swellrt-backend";

// declare let swellrt: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit, OnDestroy {

  private _displayLoader = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _adminSide = false;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private loaderService: LoaderService,
              private scrollService: ScrollService,
              private location: Location,
              // private _swellrtBackend: SwellrtBackend,
              private router: Router) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollService.setScrollValue(window.pageYOffset || window.scrollY || 0);
  }

  ngOnInit(): void {

    this._adminSide = this.location.path().slice(5, 11) === '/admin';

    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this._adminSide = this.location.path().slice(5, 11) === '/admin';
        }
      });
    }

    this.loaderService.isLoading$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((isLoading: boolean) => {
      // Bug corrigé avec setTimeout :
      // https://stackoverflow.com/questions/38930183/angular2-expression-has-changed-after-it-was-checked-binding-to-div-width-wi
      setTimeout((_: void) => {
        this._displayLoader = isLoading;
      });
    });

    // this.startSwellRTClient();

    // this.verifyUser();

    this.loaderService.stopLoading();

  }

  /*private startSwellRTClient() {
    // Try to start the swellrt client
    this._swellrtBackend.bind(new Promise(
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

  /*private verifyUser() {
    this._swellrtBackend.loginSwellRT()
    //this._swellrtBackend.createUser(null)
      .then(p=>{
        console.log(p);
        this.getUserProfile();
      });
  }

  private getUserProfile() {
    this._swellrtBackend.getUserSRT("")
      .then(p => {
        console.log(p);
      });
  }*/

  get displayLoader(): boolean {
    return this._displayLoader;
  }

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
