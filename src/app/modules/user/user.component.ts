import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { LoaderService } from '../../services/loader/loader.service';
import { Subject } from 'rxjs';
import { isPlatformBrowser, Location } from '@angular/common';
import { SwellrtBackend } from "../swellrt-client/services/swellrt-backend";
import { UserService } from "../../services/user/user.service";

declare let swellrt;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit, OnDestroy {

  private _displayLoader = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _adminSide = false;

  private _displayLoading = false;

  private _pages: Array<string> = ['/projects', '/discover', '/synthesis','/account', '/admin', '/users', '/professionals', '/community', '/libraries', '/monitoring', '/settings'];

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private loaderService: LoaderService,
              private location: Location,
              private _userService: UserService,
              private _swellrtBackend: SwellrtBackend,
              private router: Router) {

    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((event) => {

        if (event instanceof NavigationEnd) {
          this._adminSide = this.location.path().slice(5, 11) === '/admin';

          setTimeout(() => {
            this._displayLoading = false;
          }, 300);

        } else if (event instanceof NavigationStart || !this.router.navigated) {

          this._pages.forEach((page: string) => {
            if (this.location.path().endsWith(page)) {
              this._displayLoading = true;
            }
          });

        }
      });
    }

  }

  ngOnInit(): void {

    this._adminSide = this.location.path().slice(5, 11) === '/admin';

    this.loaderService.isLoading$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((isLoading: boolean) => {
      // Bug corrigé avec setTimeout :
      // https://stackoverflow.com/questions/38930183/angular2-expression-has-changed-after-it-was-checked-binding-to-div-width-wi
      setTimeout((_: void) => {
        this._displayLoader = isLoading;
      });
    });

    this.startSwellRTClient();

    this.startSwellRTSession();

    this.loaderService.stopLoading();

  }


  private startSwellRTSession() {
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
  }


  get displayLoader(): boolean {
    return this._displayLoader;
  }

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

  get displayLoading(): boolean {
    return this._displayLoading;
  }

  get pages(): Array<string> {
    return this._pages;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
