import { Component, OnInit } from '@angular/core';
import { OrderItem } from 'src/app/interfaces/OrderItem';
import { OrdersService } from 'src/app/services/orders.service';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  public orders: OrderItem[] = [];
  constructor(
    private orderService: OrdersService,
    private shopcartService: ShopcartService
  ) {}

  getTotalPrice() {
    return this.orders.map((x) => this.getPrice(x)).reduce((a, b) => a + b, 0);
  }

  getPrice(order: OrderItem): number {
    return this.orderService.getPrecio(order);
  }

  remove(order: OrderItem): void {
    this.shopcartService.remove(order);
  }

  ngOnInit(): void {
    this.orders = this.shopcartService.getCart();
    this.shopcartService.getCart$().subscribe((orders) => {
      this.orders = orders;
    });
  }
}
