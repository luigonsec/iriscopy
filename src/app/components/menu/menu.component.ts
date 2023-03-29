import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OrderItem } from 'src/app/interfaces/OrderItem';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public items: MenuItem[];
  public orders: OrderItem[];
  public display: boolean = true;

  @ViewChild('sidebar') public sidebar: SidebarComponent;

  constructor(private shopcartService: ShopcartService) {
    this.orders = [];
  }

  subscribeCart() {
    this.shopcartService.getCart$().subscribe((orders: OrderItem[]) => {
      this.orders = orders;
    });
  }

  toggleSidebar() {
    this.sidebar.toggle();
  }

  ngOnInit() {
    this.orders = this.shopcartService.getCart();
    this.subscribeCart();
  }
}
