import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/interfaces/Order';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-confirm-bar',
  templateUrl: './confirm-bar.component.html',
  styleUrls: ['./confirm-bar.component.scss'],
})
export class ConfirmBarComponent implements OnInit {
  private precios = {
    color: {
      'una-cara': {
        A4: (paginas) => {
          if (paginas <= 20) return 0.14;
          if (paginas <= 50) return 0.13;
          if (paginas <= 150) return 0.12;
          return 0.114;
        },
        A3: (paginas) => {
          if (paginas <= 20) return 0.28;
          if (paginas <= 50) return 0.26;
          if (paginas <= 150) return 0.24;
          return 0.228;
        },
      },
      'doble-cara': {
        A4: (paginas) => {
          if (paginas <= 20) return 0.14;
          if (paginas <= 50) return 0.13;
          if (paginas <= 150) return 0.12;
          return 0.114;
        },
        A3: (paginas) => {
          if (paginas <= 20) return 0.28;
          if (paginas <= 50) return 0.26;
          if (paginas <= 150) return 0.24;
          return 0.228;
        },
      },
    },
    'blanco-negro': {
      'una-cara': {
        A4: (paginas) => {
          if (paginas <= 50) return 0.04;
          if (paginas <= 100) return 0.038;
          if (paginas <= 250) return 0.036;
          if (paginas <= 500) return 0.034;
          return 0.033;
        },
        A3: (paginas) => {
          if (paginas <= 50) return 0.08;
          if (paginas <= 100) return 0.076;
          if (paginas <= 250) return 0.072;
          if (paginas <= 500) return 0.068;
          return 0.066;
        },
      },
      'doble-cara': {
        A4: (paginas) => {
          if (paginas <= 50) return 0.034;
          if (paginas <= 100) return 0.031;
          if (paginas <= 250) return 0.028;
          if (paginas <= 500) return 0.026;
          return 0.024;
        },
        A3: (paginas) => {
          if (paginas <= 50) return 0.068;
          if (paginas <= 100) return 0.062;
          if (paginas <= 250) return 0.056;
          if (paginas <= 500) return 0.052;
          return 0.048;
        },
      },
    },
    'color-eco': {
      'una-cara': {
        A4: (paginas) => {
          if (paginas <= 50) return 0.08;
          if (paginas <= 100) return 0.075;
          if (paginas <= 250) return 0.072;
          if (paginas <= 500) return 0.07;
          return 0.068;
        },
        A3: (paginas) => {
          if (paginas <= 50) return 0.16;
          if (paginas <= 100) return 0.15;
          if (paginas <= 250) return 0.148;
          if (paginas <= 500) return 0.14;
          return 0.136;
        },
      },
      'doble-cara': {
        A4: (paginas) => {
          if (paginas <= 50) return 0.075;
          if (paginas <= 100) return 0.07;
          if (paginas <= 250) return 0.065;
          if (paginas <= 500) return 0.062;
          return 0.058;
        },
        A3: (paginas) => {
          if (paginas <= 50) return 0.15;
          if (paginas <= 100) return 0.14;
          if (paginas <= 250) return 0.135;
          if (paginas <= 500) return 0.124;
          return 0.116;
        },
      },
    },
  };

  @Input('order') order: Order;
  constructor(
    private orderService: OrdersService,
    private messageService: MessageService
  ) {}

  getPrecio() {
    if (this.order && this.order.file) {
      const factorDobleCara =
        this.order.printForm.code === 'doble-cara' ? 0.5 : 1;
      const pages = Math.ceil(
        (this.order.file.pages * factorDobleCara) /
          +this.order.pagesPerSide.code
      );

      const pricePerPage =
        this.precios[this.order.printType.code][this.order.printForm.code][
          this.order.paperSize.code
        ](pages) + this.order.paperGrammage.factor;

      return (pricePerPage * pages).toFixed(2);
    }
  }

  onClick() {
    this.orderService.create(this.order).subscribe(
      () => {
        console.log('AAAA');

        this.messageService.add({
          severity: 'success',
          summary: 'Sent',
          detail: 'All right',
        });
      },
      (err) => {
        console.log('EEE');
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
