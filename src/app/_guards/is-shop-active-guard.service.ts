import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root',
})
export class IsShopActiveGuard  {
  constructor(private route: Router, private configService: ConfigService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.configService.getConfig().pipe(
      map((configuration: any) => {
        if (configuration.shop_active) {
          return configuration.shop_active;
        } else {
          return this.route.navigateByUrl('/');
        }
      })
    );
  }
}
