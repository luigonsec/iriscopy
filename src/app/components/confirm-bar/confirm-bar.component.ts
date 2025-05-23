import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import { OrdersService } from 'src/app/services/orders.service';
import { ShopcartService } from 'src/app/services/shopcart.service';
import * as uuid from 'uuid';
import JSONfn from 'json-fn';

@Component({
  selector: 'app-confirm-bar',
  templateUrl: './confirm-bar.component.html',
  styleUrls: ['./confirm-bar.component.scss'],
})
export class ConfirmBarComponent implements OnInit, OnChanges {
  @Input('order') order: OrderCopy;
  @Input('reset') reset: () => void = () => undefined;

  public precio: number = 0;
  public notas: string[] = [];
  disableButtons: boolean = false;

  constructor(
    private orderService: OrdersService,
    private shopcartService: ShopcartService,
    private router: Router
  ) {}

  checkButtonsEnabled() {
    if (
      this.notas?.length &&
      (this.order?.additionalComments || '').trim() === ''
    ) {
      this.disableButtons = true;
    } else {
      this.disableButtons = false;
    }
  }

  getPrecio() {
    const others = this.shopcartService.getCart().copies;
    others.push(this.order);
    this.orderService
      .getCopyPrice(this.order, others)
      .subscribe(({ precio, notas }) => {
        this.precio = precio;
        this.notas = notas;
        this.checkButtonsEnabled();
      });
  }

  ngOnChanges(): void {
    this.getPrecio();
    this.checkButtonsEnabled();
  }

  addConfiguration() {
    this.order.id = uuid.v4();
    // TODO: Copy
    const order = JSONfn.parse(JSONfn.stringify(this.order));
    this.shopcartService.addCopyToCart(order);
    this.reset();
    window.scrollTo(0, 0);
  }

  finishAndPay() {
    this.addConfiguration();
    this.router.navigate(['payment']);
  }

  ngOnInit(): void {
    this.getPrecio();
  }
}
