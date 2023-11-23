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

  public total_price: number;
  constructor(
    private orderService: OrdersService,
    private shopcartService: ShopcartService
  ) {}

  getTotalPrice() {
    return this.orders.map((x) => this.getPrice(x)).reduce((a, b) => a + b, 0);
  }

  getPrice(order: OrderItem): number {
    return this.orderService.getPrecio(order, this.orders);
  }

  remove(order: OrderItem): void {
    this.shopcartService.remove(order);
  }

  removeFile(order_id: string, files_id: number) {
    console.log(this.orders);

    const orderIndex = this.orders.findIndex((order) => order.id === order_id);

    if (orderIndex !== -1) {
      const order = this.orders[orderIndex];
      const files = order.files;
      this.orders[orderIndex].files = files.filter(
        (file) => file.id !== files_id
      );

      if (this.orders[orderIndex].files.length === 0) {
        this.orders.splice(orderIndex, 1);
      }

      this.shopcartService.update(order);
    }
    console.log(this.orders);
  }

  ngOnInit(): void {
    this.orders = this.shopcartService.getCart();
    this.shopcartService.getCart$().subscribe((orders) => {
      this.orders = orders;
    });
  }
}
