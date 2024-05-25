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

  @ViewChild('sidebar') public sidebar: SidebarComponent;
  cartSubscription: Subscription;
  shop_active: boolean;
  customer$: Subscription;
  customer: Customer;

  constructor(
    private shopcartService: ShopcartService,
    private store: Store,
    private router: Router
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

  ngOnInit() {
    this.copies = this.shopcartService.getCart().copies;
    this.products = this.shopcartService.getCart().products;
    this.subscribeCart();
  }
}
