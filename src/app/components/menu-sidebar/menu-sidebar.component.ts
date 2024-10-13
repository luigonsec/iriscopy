import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss'],
})
export class MenuSidebarComponent implements OnInit {
  @Input('sidebarVisible') public sidebarVisible = false;
  @Input('isShopActive') public isShopActive;
  public puntosRecogida: { label: string; routerLink: string }[];
  public puntosRecogidaOpened = false;

  setPuntosRecogida() {
    this.puntosRecogida = [
      {
        label: 'Copisterías en Sevilla',
        routerLink: 'https://iriscopyshop.com/copisteria-sevilla/',
      },
      {
        label: 'Copistería ETSI',
        routerLink: 'https://iriscopyshop.com/copisteria-etsi/',
      },
      {
        label: 'Copistería Sevilla centro',
        routerLink: 'https://iriscopyshop.com/copisteria-sevilla-centro/',
      },
      {
        label: 'Copistería FCOM',
        routerLink: 'https://iriscopyshop.com/copisteria-fcom/',
      },
      {
        label: 'Copistería Mairena del Aljarafe',
        routerLink: 'https://iriscopyshop.com/copisteria-mairena-aljarafe/',
      },
      {
        label: 'Copistería Viapol',
        routerLink: 'https://iriscopyshop.com/copisteria-viapol/',
      },
      {
        label: 'Copistería Reina Mercedes',
        routerLink: 'https://iriscopyshop.com/copisteria-reina-mercedes/',
      },
    ];
  }

  ngOnInit(): void {
    this.setPuntosRecogida();
  }
}
