import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { ShopcartWrapperComponent } from '../shopcart-wrapper/shopcart-wrapper.component';
import Cart from 'src/app/interfaces/Cart';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import Customer from 'src/app/interfaces/Customer';
import { logout } from 'src/app/_actions/customer.actions';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  public items: MenuItem[];
  public display: boolean = true;
  public shop_active: boolean = false;
  public sidebarVisible = true;

  public mobileMenuOpened = false;

  @ViewChild('menu') public menu: Menu;
  @ViewChild('menuImprenta') public menuImprenta: Menu;
  @ViewChild('shopcartWrapper') public shopcart: ShopcartWrapperComponent;

  cartSubscription: Subscription;
  customer$: Subscription;
  customer: Customer;
  configSubscription: Subscription;
  profile: MenuItem[];
  puntosRecogida: MenuItem[];
  opcionesImprenta: MenuItem[];
  cart: Cart;

  constructor(
    private shopcartService: ShopcartService,
    private store: Store,
    private router: Router,
    private config: ConfigService
  ) {
    this.customer$ = this.store
      .select(selectCustomer)
      .subscribe((customer: Customer) => {
        this.customer = customer;
      });
  }
  ngOnDestroy(): void {
    this.customer$.unsubscribe();
    this.cartSubscription.unsubscribe();
    this.configSubscription.unsubscribe();
  }

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
    this.setProfile();
  }

  subscribeCart() {
    this.cartSubscription = this.shopcartService
      .getCart$()
      .subscribe((cart: Cart) => {
        this.cart = cart;
      });
  }

  toggleShoppingCart() {
    this.shopcart.toggle();
  }

  toggleMobileMenu = () => {
    this.mobileMenuOpened = !!!this.mobileMenuOpened;
  };

  getConfig() {
    this.config.getConfig().subscribe((conf: { shop_active: boolean }) => {
      this.shop_active = conf.shop_active;
    });
    this.configSubscription = this.config.config$.subscribe(
      (conf: { shop_active: boolean }) => {
        this.shop_active = conf.shop_active;
      }
    );
  }

  iconProfileClicked($event) {
    this.setProfile();
    if (this.customer) {
      this.menu.toggle($event);
    } else {
      this.router.navigate(['/login']);
    }
  }

  navigateToImprentaPage(path: string, event?: any) {
    if (event?.originalEvent) {
      event.originalEvent.stopPropagation();
      event.originalEvent.preventDefault();
    }
    this.menuImprenta.hide();
    this.router.navigate([path]);
  }

  setMenuImprenta() {
    this.opcionesImprenta = [
      {
        label: 'Tarjetas de visita',
        icon: 'pi pi-fw pi-id-card',
        command: ($event) => {
          this.navigateToImprentaPage('/imprenta/tarjetas-visita', $event);
        },
      },
      {
        label: 'Flyers',
        icon: 'pi pi-fw pi-paperclip',
        command: ($event) => {
          this.navigateToImprentaPage('/imprenta/flyers', $event);
        },
      },
      {
        label: 'Carpetas',
        icon: 'pi pi-fw pi-folder',
        command: ($event) => {
          this.navigateToImprentaPage('/imprenta/carpetas', $event);
        },
      },
      // {
      //   label: 'Revistas',
      //   icon: 'pi pi-fw pi-book',
      //   command: ($event) => {
      // this.menuImprenta.hideu()
      // const path = // '/imprenta/revistas'
      // this.router.navigate([path]);
      // }
      // ,
      // },
      {
        label: 'Rollups',
        icon: 'pi pi-fw pi-image',
        command: ($event) => {
          this.navigateToImprentaPage('/imprenta/rollups', $event);
        },
      },
      // ,
      // },
      // {
      //   label: 'Carteles',
      //   icon: 'pi pi-fw pi-image',
      //   command: ($event) => {
      // this.menuImprenta.hideu()
      // const path = '/imprenta/carteles'
      // this.router.navigate([path]);
      // }
      // ,
      // },
      {
        label: 'Dípticos',
        icon: 'pi pi-fw pi-image',
        command: ($event) => {
          this.navigateToImprentaPage('/imprenta/dipticos', $event);
        },
      },
      {
        label: 'Trípticos',
        icon: 'pi pi-fw pi-image',
        command: ($event) => {
          this.navigateToImprentaPage('/imprenta/tripticos', $event);
        },
      },
    ];
  }

  setPuntosRecogida() {
    this.puntosRecogida = [
      {
        label: 'Copisterías en Sevilla',
        url: 'https://iriscopyshop.com/copisteria-sevilla',
      },
      {
        label: 'Copistería ETSI',
        url: 'https://iriscopyshop.com/copisteria-etsi',
      },
      {
        label: 'Copistería Sevilla centro',
        url: 'https://iriscopyshop.com/copisteria-sevilla-centro',
      },
      {
        label: 'Copistería FCOM',
        url: 'https://iriscopyshop.com/copisteria-fcom',
      },
      {
        label: 'Copistería Mairena del Aljarafe',
        url: 'https://iriscopyshop.com/copisteria-mairena-aljarafe',
      },
      {
        label: 'Copistería Viapol',
        url: 'https://iriscopyshop.com/copisteria-viapol',
      },
      {
        label: 'Copistería Reina Mercedes',
        url: 'https://iriscopyshop.com/copisteria-reina-mercedes',
      },
    ];
  }

  setProfile() {
    this.profile = [
      {
        visible: this.customer != undefined,
        label: 'Tus datos',
        routerLink: '/profile/information',
      },
      {
        visible: this.customer != undefined && this.customer.admin,
        label: 'Administrar',
        routerLink: '/admin/banner',
      },
      {
        visible: this.customer != undefined,
        label: 'Salir',
        command: () => {
          this.logout();
        },
      },
    ];
  }

  public elementsInCart(): number {
    const total = Object.keys(this.cart)
      .map((key) => {
        return this.cart[key].length;
      })
      .reduce((a, b) => a + b, 0);
    return total;
  }

  ngOnInit() {
    this.getConfig();
    this.setPuntosRecogida();
    this.setMenuImprenta();
    this.setProfile();
    this.cart = this.shopcartService.getCart();
    this.subscribeCart();
  }
}
