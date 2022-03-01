import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpCacheService} from '../services/http-cache/http-cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {

  constructor(private _httpCacheService: HttpCacheService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /**
     * pass for PUT, DELETE, POST requests
     */
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    /**
     * clear all the cache entries
     */
    if (request.headers.get('cache') === 'clear') {
      this._httpCacheService.clearCache();
    }

    /**
     * delete the cache entry of that URL from the Cached object.
     */
    if (request.headers.get('cache') === 'reset') {
      this._httpCacheService.delete(request.urlWithParams);
    }

    /**
     * checking if there is already cached data for this url
     */
    const cachedResponse = this._httpCacheService.get(request.urlWithParams);

    /**
     * returned the cached response
     */
    if (!!cachedResponse) {
      return of(cachedResponse.clone());
    }

    /**
     * request is going for the first time then let the request process
     * and cache the response
     */
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this._httpCacheService.set(request.urlWithParams, event.clone());
        }
        return event;
      })
    );

  }
}
