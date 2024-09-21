import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  items: MenuItem[] = [];
  activeItem: MenuItem;
  constructor() {}
  ngOnInit(): void {
    this.items = [
      {
        label: 'Información personal',
        routerLink: '/profile/information',
      },
      {
        label: 'Pedidos',
        routerLink: '/profile/orders',
      },
      {
        label: 'Seguridad',
        routerLink: '/profile/security',
      },
    ];

    this.activeItem = this.items[0];
  }
}
