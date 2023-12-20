import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.scss'],
})
export class AdminIndexComponent implements OnInit {
  items: MenuItem[] = [];
  activeItem: MenuItem = {
    label: 'Tienda',
    routerLink: 'shop',
  };

  ngOnInit(): void {
    this.items = [
      {
        label: 'Banners',
        routerLink: 'banner',
      },
      {
        label: 'Tienda',
        routerLink: 'shop',
      },
    ];
  }
}
