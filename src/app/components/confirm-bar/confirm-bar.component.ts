import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/interfaces/Order';
import { OrdersService } from 'src/app/services/orders.service';
import { ShopcartService } from 'src/app/services/shopcart.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-confirm-bar',
  templateUrl: './confirm-bar.component.html',
  styleUrls: ['./confirm-bar.component.scss'],
})
export class ConfirmBarComponent implements OnInit {
  @Input('order') order: Order;
  @Input('reset') reset: () => void = () => undefined;
  constructor(
    private orderService: OrdersService,
    private messageService: MessageService,
    private shopcartService: ShopcartService
  ) {}

  getPrecio() {
    return this.orderService.getPrecio(this.order);
  }

  addConfiguration() {
    this.order.id = uuid.v4();
    // TODO: Copy
    const order = JSON.parse(JSON.stringify(this.order));
    this.shopcartService.addToCart(order);
    this.reset();
  }

  onClick() {
    this.orderService.create(this.order).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          detail: 'Su pedido ha sido recibido y se está procesando',
          summary: '¡Recibido!',
        });
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          detail: 'Ha habido un error y su pedido no ha podido procesarse',
          summary: '¡Error!',
        });
      }
    );
  }

  ngOnInit(): void {}
}
