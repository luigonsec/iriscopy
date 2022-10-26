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
  @Input('order') order: Order;
  constructor(
    private orderService: OrdersService,
    private messageService: MessageService
  ) {}

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
