import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import Cart from 'src/app/interfaces/Cart';
import { Store } from '@ngrx/store';
import OrderProduct from 'src/app/interfaces/OrderProduct';
import { Subscription } from 'rxjs';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import Customer from 'src/app/interfaces/Customer';
import { logout } from 'src/app/_actions/customer.actions';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public items: MenuItem[];
  public copies: OrderCopy[] = [];
  public products: OrderProduct[] = [];
  public display: boolean = true;
  public shop_active: boolean = false;
  public sidebarVisible = false;

  @ViewChild('sidebar') public sidebar: SidebarComponent;
  cartSubscription: Subscription;
  customer$: Subscription;
  customer: Customer;
  configSubscription: Subscription;

  constructor(
    private shopcartService: ShopcartService,
    private store: Store,
    private router: Router,
    private config: ConfigService
  ) {
    this.copies = [];
    this.customer$ = this.store
      .select(selectCustomer)
      .subscribe((customer: Customer) => {
        this.customer = customer;
      });
  }
  ngOnDestroy(): void {
    this.customer$.unsubscribe();
    this.cartSubscription.unsubscribe();
    this.configSubscription.unsubscribe();
  }

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

  subscribeCart() {
    this.cartSubscription = this.shopcartService
      .getCart$()
      .subscribe((orders: Cart) => {
        this.copies = orders.copies;
        this.products = orders.products;
      });
  }

  toggleSidebar() {
    this.sidebar.toggle();
  }

  getConfig() {
    this.config.getConfig().subscribe((conf: { shop_active: boolean }) => {
      this.shop_active = conf.shop_active;
    });
  }

  openSidebar() {}

  ngOnInit() {
    this.getConfig();
    this.configSubscription = this.config.config$.subscribe(
      (conf: { shop_active: boolean }) => {
        this.shop_active = conf.shop_active;
      }
    );
    this.copies = this.shopcartService.getCart().copies;
    this.products = this.shopcartService.getCart().products;
    this.subscribeCart();
  }
}
