import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss'],
    standalone: false
})
export class OrderDetailsComponent {
  public order;
  constructor(public conf: DynamicDialogConfig) {
    const order = conf.data.order;
    this.order = order;
  }
}
