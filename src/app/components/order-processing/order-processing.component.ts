import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import Coupon from 'src/app/interfaces/Coupon';
import Location from 'src/app/interfaces/Location';
import Order from 'src/app/interfaces/Order';
import RedsysData from 'src/app/interfaces/RedsysData';
import { CouponHandlerService } from 'src/app/services/coupon-handler.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OrdersService } from 'src/app/services/orders.service';
import { RedsysService } from 'src/app/services/redsys.service';
import { OrderBuilderService } from 'src/app/services/order-builder.service';
import { ShippingHandlerService } from 'src/app/services/shipping-handler.service';
import {
  CartItemType,
  ShopcartService,
} from 'src/app/services/shopcart.service';
import locations from 'src/config/locations';
import { BillingComponent } from 'src/app/components/forms/billing/billing.component';
import { ShippingComponent } from 'src/app/components/forms/shipping/shipping.component';
import { Subscription, forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import Customer from 'src/app/interfaces/Customer';
import generalConfig from 'src/config/general';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import OrderProduct from 'src/app/interfaces/OrderProduct';
import { HttpErrorResponse } from '@angular/common/http';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { PricesService } from '../../services/prices.service';
import { PriceResult } from '../../interfaces/PriceResult';
import Flyer from '../../interfaces/Flyer';
import TarjetaVisita from '../../interfaces/TarjetaVisita';
import Carpeta from '../../interfaces/Carpeta';
import Diptico from '../../interfaces/Diptico';
import Triptico from '../../interfaces/Triptico';
import Rollup from '../../interfaces/Rollup';
import Cartel from '../../interfaces/Cartel';
import Revista from '../../interfaces/Revista';
import Cart from '../../interfaces/Cart';

@Component({
  selector: 'app-order-processing',
  templateUrl: './order-processing.component.html',
  styleUrls: ['./order-processing.component.scss'],
})
export class OrderProcessingComponent implements OnInit, OnDestroy {
  public PAYMENT_MINIMUM_PRICE_BIZUM =
    generalConfig.PAYMENT_MINIMUM_PRICE_BIZUM;
  public PAYMENT_MINIMUM_PRICE_CARD = generalConfig.PAYMENT_MINIMUM_PRICE_CARD;
  public inputCoupon: string;
  public coupon: Coupon;
  public payment: string;
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

  public first_time_coupon_applied = false;

  public locations = locations;
  public selectedLocation: Location;
  public termsAccepted: boolean;
  public redsysData: RedsysData = {
    Ds_MerchantParameters: undefined,
    Ds_Signature: undefined,
    Ds_SignatureVersion: undefined,
  };
  public expectedDeliveryDate: string;
  public urgentShippingAvailable = true;
  public standardShippingAvailable = true;

  public OrderID;
  @ViewChild('redsysForm') redsysForm;
  @Input('billing') public billing: BillingComponent;
  @Input('shipping') public shipping: ShippingComponent;
  @Input('customer') public customer: Customer;
  @Input('differentAddress') public differentAddress = false;

  @Input('updateDeliveryMethod') public updateDeliveryMethod: (
    delivery: string
  ) => void;
  public deliver: string = 'Pickup';

  public subcriptorCoupon: Subscription;
  public subscriptionCart: Subscription;
  subtotal: number = 0;
  precioEnvio: number = 0;
  total: number = 0;
  discount: number = 0;

  apply_cupon_text = 'Aplicar mi cupón';
  searching_coupon = false;
  precio_copias: number = 0;
  shippingCostStandard: number = 4.9;
  shippingCostFinal: number = 0;
  shippingCostUrgent: number = 6.9;

  public itemsPrice: { [id: string]: number } = {};
  public itemsNotes: { [id: string]: string[] } = {};

  constructor(
    private shopcartService: ShopcartService,
    private orderService: OrdersService,
    private redsysService: RedsysService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private couponHandlerService: CouponHandlerService,
    private pricesService: PricesService,
    private shippingHandlerService: ShippingHandlerService,
    private analytics: AnalyticsService,
    private orderBuilderService: OrderBuilderService
  ) {}

  public infoPagoAnalytics() {
    this.analytics.infoPago(
      [
        {
          item_name: 'Método de pago',
          item_id: 1,
          price: this.total,
          item_brand: 'IrisCopy',
        },
      ],
      this.payment
    );
  }

  public infoEntregaAnalytics() {
    this.analytics.infoEntrega(
      [
        {
          item_name: 'Método de entrega',
          item_id: 1,
          price: this.total,
          item_brand: 'IrisCopy',
        },
      ],
      this.deliver
    );
  }

  public removeCoupon() {
    this.coupon = undefined;
    this.couponHandlerService.removeCoupon();
  }

  public getCoupon() {
    this.first_time_coupon_applied = true;
    this.couponHandlerService.getCoupon(this.inputCoupon).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  public validateCoupon(coupon) {
    if (!coupon) return false;

    const result = this.couponHandlerService.validateCoupon(
      coupon,
      this.precio_copias,
      this.calcularPrecios.bind(this)
    );

    if (result) {
      this.coupon = coupon;
      this.discount = this.coupon.amount;
    }

    return result;
  }

  public validate() {
    const validBilling = this.billing.validate();
    if (!validBilling) return;

    if (this.differentAddress) {
      const validShipping = this.shipping.validate();
      if (!validShipping) {
        return;
      }
    }

    this.infoEntregaAnalytics();

    if (this.deliver === 'Pickup' && !this.selectedLocation) {
      return this.messageService.add({
        severity: 'error',
        detail: 'Debes seleccionar un local de recogida',
        summary: 'Error',
      });
    }
    if (!['BIZUM', 'CARD'].includes(this.payment)) {
      return this.messageService.add({
        severity: 'error',
        detail: 'Debes indicar un "Método de pago"',
        summary: 'Error',
      });
    }

    if (
      this.payment == 'BIZUM' &&
      this.getSubtotalWithDiscount() < this.PAYMENT_MINIMUM_PRICE_BIZUM
    ) {
      return this.messageService.add({
        severity: 'error',
        detail: `El pago por bizum no es posible para pedidos inferiores a ${this.PAYMENT_MINIMUM_PRICE_BIZUM}€`,
        summary: 'Error',
      });
    }

    if (
      this.payment == 'CARD' &&
      this.getSubtotalWithDiscount() < this.PAYMENT_MINIMUM_PRICE_CARD
    ) {
      return this.messageService.add({
        severity: 'error',
        detail: `El pago con tarjeta no es posible para pedidos inferiores a ${this.PAYMENT_MINIMUM_PRICE_CARD}€`,
        summary: 'Error',
      });
    }

    if (!this.termsAccepted) {
      return this.messageService.add({
        severity: 'error',
        detail: 'Debes aceptar los términos y condiciones',
        summary: 'Error',
      });
    }

    this.processOrder();
  }

  public startPayment(order, callback) {
    this.loadingService.setLoading({
      isLoading: true,
      text: 'Redirigiendo a pasarela de pago',
    });
    this.redsysService.sendPayment(order, this.payment).subscribe({
      next: (redsysData: RedsysData) => {
        this.redsysData = redsysData;
        this.loadingService.stopLoading();
        return callback();
      },
      error: (err: HttpErrorResponse) => {
        this.loadingService.setLoading({
          isLoading: false,
        });
        this.messageService.add({
          severity: 'error',
          summary: 'Error en el pago',
          detail: err.error.message,
        });
      },
    });
  }

  public calculateGastosDeEnvioEstandar() {
    const shippingCosts = this.shippingHandlerService.calculateShippingCosts(
      this.billing,
      this.shipping,
      this.differentAddress,
      this.subtotal,
      this.discount
    );

    this.shippingCostStandard = shippingCosts.standardCost;
    this.shippingCostUrgent = shippingCosts.urgentCost;
    this.urgentShippingAvailable = shippingCosts.urgentAvailable;
    this.standardShippingAvailable = shippingCosts.standardAvailable;

    if (!this.urgentShippingAvailable) {
      this.deliver = 'Pickup';
    }
  }

  public getTotal() {
    this.total = this.getSubtotalWithDiscount() + this.shippingCostFinal;
  }

  public getSubtotalWithDiscount() {
    return this.subtotal - this.discount;
  }

  private getPrecioCopias() {
    this.subtotal = 0;

    return this.pricesService.getOrderPrice(this.copies);
  }

  public getDiscount() {
    const subtotal = this.precio_copias;
    this.discount = this.couponHandlerService.getDiscount(
      subtotal,
      this.coupon
    );
  }

  public processOrder() {
    this.prepareOrder((err, order) => {
      if (err) {
        return this.messageService.add({
          severity: 'error',
          detail:
            'No ha sido posible procesar el pedido. Por favor, vuelva a intentarlo.',
          summary: 'Error',
        });
      }
      this.startPayment(order, () => {
        setTimeout(() => this.redsysForm.nativeElement.submit());
      });
    });
  }

  public async prepareOrder(callback): Promise<void> {
    this.setLoadingState(true, 'Preparando pedido');

    const order: Order = this.orderBuilderService.buildOrderObject(
      this.customer,
      this.coupon,
      this.billing,
      this.shipping,
      this.differentAddress,
      this.copies,
      this.products,
      this.payment,
      this.deliver,
      this.selectedLocation
    );

    this.orderService.create(order).subscribe({
      next: (response: { order: number }) => {
        const orderID = response.order;
        this.OrderID = orderID;
        order.id = orderID;
        return callback(null, order);
      },
      error: (err) => {
        this.loadingService.setLoading({
          isLoading: false,
        });
        return callback(err);
      },
    });
  }

  private setLoadingState(isLoading: boolean, text?: string): void {
    this.loadingService.setLoading({
      isLoading,
      text: text || '',
    });
  }

  // Los métodos getShippingLine, getFlattenFiles y buildOrderObject
  // han sido trasladados al servicio OrderBuilderService

  // Los métodos setShippingProperties y setPickupProperties
  // han sido trasladados al servicio OrderBuilderService

  // Los métodos addWorkingDays y el cálculo completo de fechas de envío
  // han sido trasladados al servicio ShippingHandlerService

  handleDeliveryMethodChange() {
    this.updateDeliveryMethod(this.deliver);
    this.calcularPrecios();
  }

  getPrintItemPrices(): Observable<any[]> {
    const observables: Observable<any>[] = [];

    Object.values(CartItemType).forEach((itemType) => {
      const propertyName = this.itemTypePropertyMap[itemType];
      if (!propertyName) return;

      const items = this[propertyName];
      if (!items || !items.length || itemType === CartItemType.PRODUCT) return;

      items.forEach((item) => {
        const observable = this.getItemPriceObservable(itemType, item);
        if (observable) {
          observables.push(observable);
        }
      });
    });

    // Si no hay observables, devolvemos un array vacío como observable
    return observables.length ? forkJoin(observables) : of([]);
  }

  private getItemPriceObservable(
    itemType: CartItemType,
    item: any
  ): Observable<any> {
    try {
      // Caso especial para copies que necesitan el array completo de copies
      if (itemType === CartItemType.COPY) {
        return this.pricesService
          .getCopyPrice(item, this.copies)
          .pipe(this.processPriceResultOperator(item));
      } else {
        return this.pricesService
          .getItemPrice(itemType, item)
          .pipe(this.processPriceResultOperator(item));
      }
    } catch (error) {
      console.error(
        `Error al obtener el precio para el tipo ${itemType}:`,
        error
      );
      return null;
    }
  }

  private processPriceResultOperator(item: any) {
    return map((result: PriceResult) => {
      this.itemsPrice[item.id] = result.precio;
      this.itemsNotes[item.id] = result.notas;
      return result;
    });
  }

  // Los métodos originales getItemPrice y processPriceResult han sido reemplazados por
  // getItemPriceObservable y processPriceResultOperator que trabajan con Observables

  private itemTypePropertyMap = {
    [CartItemType.COPY]: 'copies',
    [CartItemType.PRODUCT]: 'products',
    [CartItemType.BUSINESS_CARD]: 'businessCards',
    [CartItemType.FLYER]: 'flyers',
    [CartItemType.FOLDER]: 'folders',
    [CartItemType.DIPTYCH]: 'diptychs',
    [CartItemType.TRIPTYCH]: 'triptychs',
    [CartItemType.ROLLUP]: 'rollups',
    [CartItemType.POSTER]: 'posters',
    [CartItemType.MAGAZINE]: 'magazines',
  };

  calcularPrecios(callback = undefined) {
    // Primero obtenemos el precio de las copias
    this.getPrecioCopias().subscribe((price) => {
      this.precio_copias = price;

      // Calculamos el precio de los productos (que no necesitan llamada asíncrona)
      const precioProductos =
        this.products.length > 0
          ? this.products
              .map((order) => +order.product.price * order.quantity)
              .reduce((a, b) => a + b, 0)
          : 0;

      // Iniciamos el cálculo de precios para todos los demás elementos
      this.getPrintItemPrices().subscribe({
        next: () => {
          // Una vez que todos los precios se han calculado y actualizado en itemsPrice
          // Calculamos el subtotal sumando el precio de las copias, los productos y todos los demás elementos
          this.subtotal = price + precioProductos;

          // Sumamos los precios de todos los demás tipos de elementos (que están en itemsPrice)
          Object.values(CartItemType).forEach((itemType) => {
            const propertyName = this.itemTypePropertyMap[itemType];
            if (!propertyName || itemType === CartItemType.PRODUCT) return;

            const items = this[propertyName];
            if (!items || !items.length) return;

            // Sumamos al subtotal los precios de cada tipo de elemento
            const precioItems = items
              .map((item) => this.itemsPrice[item.id] || 0)
              .reduce((a, b) => a + b, 0);

            this.subtotal += precioItems;
          });

          // Continuamos con el resto del proceso
          this.getDiscount();
          this.comprobarMetodoDePago();
          this.getGastosDeEnvio();
          this.getTotal();
          if (callback) {
            callback();
          }
        },
        error: (err) => {
          console.error('Error al calcular los precios de los elementos:', err);
          // Aún así intentamos realizar los cálculos con lo que tengamos
          this.subtotal = price + precioProductos;
          this.getDiscount();
          this.comprobarMetodoDePago();
          this.getGastosDeEnvio();
          this.getTotal();
          if (callback) {
            callback();
          }
        },
      });
    });
  }

  getGastosDeEnvio() {
    if (this.deliver === 'Shipping') {
      this.calculateGastosDeEnvioEstandar();
    }

    this.shippingCostFinal =
      this.shippingHandlerService.calculateFinalShippingCost(
        this.deliver,
        this.shippingCostStandard,
        this.shippingCostUrgent
      );

    return this.shippingCostFinal;
  }

  calculateExpectedDeliveryDate() {
    this.expectedDeliveryDate =
      this.shippingHandlerService.calculateExpectedDeliveryDate();
  }

  comprobarMetodoDePago() {
    const subtotalMasDescuento = this.subtotal + this.discount;
    if (subtotalMasDescuento < this.PAYMENT_MINIMUM_PRICE_BIZUM) {
      this.payment = 'CARD';
      this.infoPagoAnalytics();
    }
    if (subtotalMasDescuento < this.PAYMENT_MINIMUM_PRICE_CARD) {
      this.payment = null;
    }
  }

  subscribeCoupon() {
    this.subcriptorCoupon = this.couponHandlerService.subscribeCoupon(
      (coupon) => {
        this.validateCoupon(coupon);
      }
    );
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
    // Si añades más tipos en el futuro, agrégalos aquí
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

  public ngOnDestroy(): void {
    this.subcriptorCoupon.unsubscribe();
  }

  ngOnInit(): void {
    this.updateCartItems(this.shopcartService.getCart());
    this.calcularPrecios(this.subscribeCoupon.bind(this));
    this.calculateExpectedDeliveryDate();
    this.subscriptionCart = this.shopcartService
      .getCart$()
      .subscribe((order) => {
        this.updateCartItems(this.shopcartService.getCart());

        this.calcularPrecios(this.validateCoupon.bind(this, this.coupon));
      });
  }
}
