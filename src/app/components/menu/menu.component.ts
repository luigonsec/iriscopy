import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Order } from 'src/app/interfaces/Order';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public items: MenuItem[];
  public orders: Order[];
  public display: boolean = true;

  @ViewChild('sidebar') public sidebar: SidebarComponent;

  constructor(private shopcartService: ShopcartService) {
    this.orders = [];
  }

  subscribeCart() {
    this.shopcartService.getCart$().subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  toggleSidebar() {
    this.sidebar.toggle();
  }

  ngOnInit() {
    this.orders = this.shopcartService.getCart();
    this.subscribeCart();
    this.items = [
      {
        label: 'File',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [{ label: 'Project' }, { label: 'Other' }],
          },
          { label: 'Open' },
          { label: 'Quit' },
        ],
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: 'Delete', icon: 'pi pi-fw pi-trash' },
          { label: 'Refresh', icon: 'pi pi-fw pi-refresh' },
        ],
      },
    ];
  }
}
