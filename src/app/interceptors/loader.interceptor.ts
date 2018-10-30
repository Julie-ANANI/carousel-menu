import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { LoaderService } from '../services/loader/loader.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable()
export class LoaderBrowserInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.startLoading();
    return next.handle(req).pipe(
      catchError((error) => {
        console.error(error.message);
        return throwError(error.text());
      }),
      finalize(() => {
        this.loaderService.stopLoading();
      })
    );
  }

}
