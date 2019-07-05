import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Config } from '../../models/config';
import { ConfigService } from '../../services/config/config.service';
import { Response } from '../../models/response';
import { UserService } from '../../services/user/user.service';

const USERS_KEY = makeStateKey('users');

@Injectable()
export class UsersResolver implements Resolve<Response> {

  private _config: Config = {
    fields: 'id company jobTitle created domain location firstName lastName',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _transferState: TransferState,
              private _userService: UserService,
              private _configService: ConfigService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Response> {

    if (this._transferState.hasKey(USERS_KEY)) {
      const users = this._transferState.get<Response>(USERS_KEY, null);
      this._transferState.remove(USERS_KEY);

      return new Observable((observer) => {
        observer.next(users);
        observer.complete();
      });

    } else {

      this._config.limit = this._configService.configLimit('admin-user-limit');

      return this._userService.getAll(this._config)
        .pipe(
          tap((response) => {
          if (isPlatformServer(this._platformId)) {
            this._transferState.set(USERS_KEY, response as Response);
          }
        }),
        catchError(() => {
          return EMPTY;
        })
      )
    }

  }

  get config(): Config {
    return this._config;
  }

}


