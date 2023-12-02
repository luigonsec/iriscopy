import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IsAdminGuardGuard implements CanActivate {
  constructor(private route: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // TODO: Chequear que es admin del cliente en cuestion

    const customer = JSON.parse(localStorage.getItem('irisCopy_app_customer'));
    const isAdmin = customer.admin == 1;
    if (!!!isAdmin) this.route.navigate(['/']);

    return isAdmin;
  }
}
