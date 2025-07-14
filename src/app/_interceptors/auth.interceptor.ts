import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const jwtToken = localStorage.getItem('irisCopy_app_accessToken');
    if (jwtToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + jwtToken),
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
