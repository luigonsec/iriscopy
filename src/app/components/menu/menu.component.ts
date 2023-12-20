import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import Cart from 'src/app/interfaces/Cart';
import OrderProduct from 'src/app/interfaces/OrderProduct';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  public items: MenuItem[];
  public copies: OrderCopy[] = [];
  public products: OrderProduct[] = [];
  public display: boolean = true;

  @ViewChild('sidebar') public sidebar: SidebarComponent;
  cartSubscription: Subscription;
  shop_active: boolean;

  constructor(private shopcartService: ShopcartService) {
    this.copies = [];
  }
  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
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
