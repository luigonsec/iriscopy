import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/interfaces/Order';
import { OrdersService } from 'src/app/services/orders.service';
import precios from 'src/config/prices';
@Component({
  selector: 'app-confirm-bar',
  templateUrl: './confirm-bar.component.html',
  styleUrls: ['./confirm-bar.component.scss'],
})
export class ConfirmBarComponent implements OnInit {
  private precios = precios;

  @Input('order') order: Order;
  constructor(
    private orderService: OrdersService,
    private messageService: MessageService
  ) {}

  getPrecio() {
    if (this.order && this.order.files) {
      const twoSidesFactor = this.order.printForm.factor;
      const totalPages = this.order.files
        .map((x) => x.pages)
        .reduce((a, b) => a + b, 0);
      const pages = Math.ceil(
        totalPages * twoSidesFactor * this.order.pagesPerSide.factor
      );

      const pricePerPage =
        this.precios[this.order.printType.code][this.order.printForm.code][
          this.order.paperSize.code
        ](pages) + this.order.paperGrammage.factor;

      let boundPrice = 0;
      const totalBounds =
        this.order.boundType.code === 'agrupados' ? 1 : this.order.files.length;

      if (this.order.finishType.code === 'encuadernado') {
        boundPrice += 1.2;
        boundPrice += this.order.boundColors.anillas.factor || 0;
        boundPrice += this.order.boundColors.trasera.factor || 0;
        boundPrice += this.order.boundColors.delantera.factor || 0;
      }

      return (
        this.order.copiesQuantity *
        (pricePerPage * pages + boundPrice * totalBounds)
      ).toFixed(2);
    }
  }

  onClick() {
    this.orderService.create(this.order).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sent',
          detail: 'All right',
        });
      },
      (err) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sent',
          detail: 'All right',
        });
      }
    );
  }

  ngOnInit(): void {}
}
