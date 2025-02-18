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
export class ShopcartComponent implements OnInit {
  @Input('display') display: boolean = false;
  public orders: OrderCopy[] = [];
  constructor(
    private shopcartService: ShopcartService,
    private analyticsService: AnalyticsService,
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

  toggle() {
    this.display = !this.display;
    if (this.display) {
      this.analyticsService.verCarrito(
        this.orders.map((order) => {
          return this.orderService.orderCopyToAnalytics(
            order,
            this.shopcartService.getCart().copies
          );
        })
      );
    }
  }

  remove(order: OrderCopy): void {
    this.shopcartService.removeCopy(order);
    if (!this.orders.length) this.display = false;
  }

  ngOnInit(): void {}
}
