import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { logout } from 'src/app/_actions/customer.actions';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import Cart from 'src/app/interfaces/Cart';
import Customer from 'src/app/interfaces/Customer';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import { ConfigService } from 'src/app/services/config.service';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss'],
})
export class SubmenuComponent implements OnInit, OnDestroy {
  customer$: Subscription;
  customer: Customer;
  shop_active: boolean;

  public orders: OrderCopy[];
  configSubscription: Subscription;

  constructor(
    private router: Router,
    private store: Store,
    private config: ConfigService,
    private shopcartService: ShopcartService
  ) {
    this.orders = [];

    this.customer$ = this.store
      .select(selectCustomer)
      .subscribe((customer: Customer) => {
        this.customer = customer;
      });
  }

  subscribeCart() {
    this.shopcartService.getCart$().subscribe((orders: Cart) => {
      this.orders = orders.copies;
    });
  }

  // ...

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

  getConfig() {
    this.config.getConfig().subscribe((conf: { shop_active: boolean }) => {
      this.shop_active = conf.shop_active;
    });
  }

  ngOnDestroy(): void {
    this.configSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getConfig();
    this.configSubscription = this.config.config$.subscribe(
      (conf: { shop_active: boolean }) => {
        this.shop_active = conf.shop_active;
      }
    );

    this.orders = this.shopcartService.getCart().copies;
    this.subscribeCart();
  }
}
