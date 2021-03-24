import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('http') === -1) { // Si ce n'est pas une URL
      const url = (environment.apiUrl + req.url).replace('/api/auth', '/auth');
      console.log(url);
      return next.handle(
        req.clone({
          url: url,
          withCredentials: true
        })
      );
    } else {
      return next.handle(req);
    }
  }

}
