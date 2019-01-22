import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('http') === -1) { // Si ce n'est pas une URL
      return next.handle(
        req.clone({
          url: environment.apiUrl + req.url
        })
      );
    } else {
      return next.handle(req);
    }
  }

}
