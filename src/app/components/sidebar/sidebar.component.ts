import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private orderService: OrdersService,
    private router: Router
  ) {}

  continue() {
    this.display = false;
    this.router.navigate(['payment']);
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

  ngOnInit(): void {}
}
