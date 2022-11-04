import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/interfaces/Order';
import { OrdersService } from 'src/app/services/orders.service';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input('display') display: boolean = false;
  public orders: Order[] = [];
  constructor(
    private shopcartService: ShopcartService,
    private orderService: OrdersService
  ) {}

  getPrice(order: Order): number {
    return this.orderService.getPrecio(order);
  }

  edit(order) {
    this.orderService.edit(order);
    this.shopcartService.remove(order);
  }

  toggle() {
    this.display = !!!this.display;
  }

  remove(order: Order): void {
    this.shopcartService.remove(order);
    if (!!!this.orders.length) this.display = false;
  }

  getTotalPrice() {
    return this.orders.map((x) => this.getPrice(x)).reduce((a, b) => a + b, 0);
  }

  ngOnInit(): void {
    this.orders = this.shopcartService.getCart();
    this.shopcartService.getCart$().subscribe((orders) => {
      this.orders = orders;
    });
  }
}
