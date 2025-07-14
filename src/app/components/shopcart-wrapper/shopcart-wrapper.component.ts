import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { ShopcartComponent } from '../shopcart/shopcart.component';

@Component({
    selector: 'app-shopcart-wrapper',
    templateUrl: './shopcart-wrapper.component.html',
    styleUrls: ['./shopcart-wrapper.component.scss'],
    standalone: false
})
export class ShopcartWrapperComponent {
  @ViewChild('shopcart') shopcart: ShopcartComponent;
  @Input('display') display: boolean = false;
  public orders: OrderCopy[] = [];
  constructor(
    private shopcartService: ShopcartService,
    private analytics: AnalyticsService,
    private orderService: OrdersService,
    private router: Router
  ) {}

  continue() {
    this.display = false;
    this.router.navigate(['payment']);
  }

  continueShopping() {
    this.display = false;
    this.router.navigate(['print']);
  }

  edit(order) {
    this.orderService.edit(order);
    this.shopcartService.removeCopy(order);
  }

  async toggle() {
    this.display = !this.display;
    if (this.display) {
      this.notifyAnalytics();
    }
  }

  async notifyAnalytics() {
    this.analytics.verCarrito(await this.shopcartService.getAnalyticsCart());
  }

  remove(order: OrderCopy): void {
    this.shopcartService.removeCopy(order);
    if (!this.orders.length) this.display = false;
  }
}
