import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ShopcartComponent } from 'src/app/components/shopcart/shopcart.component';

import { ShopcartService } from 'src/app/services/shopcart.service';
import { BillingComponent } from 'src/app/components/forms/billing/billing.component';
import { ShippingComponent } from 'src/app/components/forms/shipping/shipping.component';
import { Subscription } from 'rxjs';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import Customer from 'src/app/interfaces/Customer';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import OrderProduct from 'src/app/interfaces/OrderProduct';
import { OrderProcessingComponent } from 'src/app/components/order-processing/order-processing.component';
import { AnalyticsService } from '../../services/analytics.service';
import Cart from '../../interfaces/Cart';
import Flyer from '../../interfaces/Flyer';
import TarjetaVisita from '../../interfaces/TarjetaVisita';
import Carpeta from '../../interfaces/Carpeta';
import Diptico from '../../interfaces/Diptico';
import Triptico from '../../interfaces/Triptico';
import Rollup from '../../interfaces/Rollup';
import Cartel from '../../interfaces/Cartel';
import Revista from '../../interfaces/Revista';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: false,
})
export class PaymentComponent implements OnInit, OnDestroy {
  public emptyCart: boolean = false;
  public differentAddress = false;
  public deliver: string = 'Pickup';
  public copies: OrderCopy[] = [];
  public products: OrderProduct[] = [];
  public flyers: Flyer[] = [];
  public businessCards: TarjetaVisita[] = [];
  public folders: Carpeta[] = [];
  public diptychs: Diptico[] = [];
  public triptychs: Triptico[] = [];
  public rollups: Rollup[] = [];
  public posters: Cartel[] = [];
  public magazines: Revista[] = [];

  @ViewChild('orderProcessing')
  public orderProcessing: OrderProcessingComponent;

  @ViewChild('shopcart') public order: ShopcartComponent;
  @ViewChild('billing') public billing: BillingComponent;
  // Cambia la inicialización de shipping a nulo
  private _shipping: ShippingComponent | null = null;

  @ViewChild('shipping', { static: false }) set shipping(
    component: ShippingComponent | null
  ) {
    this._shipping = component;
    this.cdr.detectChanges(); // Notifica a Angular que debe actualizarse.
  }
  public customer: Customer;
  public subcriptorCustomer: Subscription;
  public subscriptionCart: Subscription;

  constructor(
    private shopcartService: ShopcartService,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private analytics: AnalyticsService
  ) {
    this.subcriptorCustomer = this.store
      .select(selectCustomer)
      .subscribe((customer) => {
        if (customer) {
          this.customer = customer;
        }
      });
  }

  public updateDeliveryMethod = (deliver: string) => {
    this.deliver = deliver;
  };

  public updatePostalCode = () => {
    this.orderProcessing.calculateGastosDeEnvioEstandar();
    this.orderProcessing.getGastosDeEnvio();
    this.orderProcessing.getTotal();
  };

  public get currentShipping(): ShippingComponent | null {
    return this._shipping;
  }

  public ngOnDestroy(): void {
    this.subcriptorCustomer.unsubscribe();
    this.subscriptionCart.unsubscribe();
  }

  public onDifferentAddressChange(): void {
    this.differentAddress = !this.differentAddress;
    this.cdr.detectChanges();
  }

  async notifyAnalytics() {
    this.analytics.inicioPago(await this.shopcartService.getAnalyticsCart());
  }

  private updateCartItems(cart: Cart) {
    this.copies = cart.copies || [];
    this.products = cart.products || [];
    this.businessCards = cart.bussinessCard || [];
    this.flyers = cart.flyers || [];
    this.folders = cart.folders || [];
    this.diptychs = cart.diptychs || [];
    this.triptychs = cart.triptychs || [];
    this.rollups = cart.rollups || [];
    this.posters = cart.posters || [];
    this.magazines = cart.magazines || [];
  }

  public getTotalCartItems(): number {
    return (
      this.copies.length +
      this.products.length +
      this.flyers.length +
      this.businessCards.length +
      this.folders.length +
      this.diptychs.length +
      this.triptychs.length +
      this.rollups.length +
      this.posters.length +
      this.magazines.length
    );
  }

  public isCartEmpty(): boolean {
    return this.getTotalCartItems() === 0;
  }

  async ngOnInit() {
    this.updateCartItems(this.shopcartService.getCart());

    this.emptyCart = this.isCartEmpty();

    this.notifyAnalytics();

    this.subscriptionCart = this.shopcartService
      .getCart$()
      .subscribe((order) => {
        this.updateCartItems(this.shopcartService.getCart());
        this.emptyCart = this.isCartEmpty();
        this.notifyAnalytics();
      });
  }
}
