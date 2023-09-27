import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderItem } from 'src/app/interfaces/OrderItem';
import { OrdersService } from 'src/app/services/orders.service';
import { ShopcartService } from 'src/app/services/shopcart.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-confirm-bar',
  templateUrl: './confirm-bar.component.html',
  styleUrls: ['./confirm-bar.component.scss'],
})
export class ConfirmBarComponent implements OnInit {
  @Input('order') order: OrderItem;
  @Input('reset') reset: () => void = () => undefined;
  constructor(
    private orderService: OrdersService,
    private shopcartService: ShopcartService,
    private router: Router
  ) {}

  getPrecio() {
    const others = this.shopcartService.getCart();
    others.push(this.order);
    return this.orderService.getPrecio(this.order, others);
  }

  addConfiguration() {
    this.order.id = uuid.v4();
    // TODO: Copy
    const order = JSON.parse(JSON.stringify(this.order));
    this.shopcartService.addToCart(order);
    this.reset();
  }

  finishAndPay() {
    this.addConfiguration();
    this.router.navigate(['payment']);
  }

  ngOnInit(): void {}
}
