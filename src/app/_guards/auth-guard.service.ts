import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth.service';

const _canActivate = (auth, router) => {
  if (!auth.isLoggedIn()) {
    router.navigate(['']);
    return false;
  }
  return true;
};

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
    return _canActivate(this.auth, this.router);
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuardChild implements CanActivateChild {
  constructor(public auth: AuthService, public router: Router) {}
  canActivateChild(): boolean {
    return _canActivate(this.auth, this.router);
  }
}
