import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-shopcart',
  templateUrl: './shopcart.component.html',
  styleUrls: ['./shopcart.component.scss'],
})
export class ShopcartComponent {
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
