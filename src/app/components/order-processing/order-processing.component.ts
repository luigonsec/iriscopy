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
import { Store } from '@ngrx/store';
import { OrderItems } from '../../interfaces/OrderItems';

@Component({
  selector: 'app-order-processing',
  templateUrl: './order-processing.component.html',
  styleUrls: ['./order-processing.component.scss'],
  standalone: false,
})
export class OrderProcessingComponent implements OnInit, OnDestroy {
  @ViewChild('redsysForm') redsysForm;
  @Input('billing') public billing: BillingComponent;
  @Input('shipping') public shipping: ShippingComponent;
  @Input('customer') public customer: Customer;
  @Input('differentAddress') public differentAddress = false;

  @Input('updateDeliveryMethod') public updateDeliveryMethod: (
    delivery: string
  ) => void;
  public deliver: string = 'Pickup';

  public PAYMENT_MINIMUM_PRICE_BIZUM =
    generalConfig.PAYMENT_MINIMUM_PRICE_BIZUM;
  public PAYMENT_MINIMUM_PRICE_CARD = generalConfig.PAYMENT_MINIMUM_PRICE_CARD;
  public inputCoupon: string = undefined;
  public coupons: Coupon[] = [];
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

  public subcriptorCoupon: Subscription;
  public subscriptionCart: Subscription;
  subtotal: number = 0;
  subtotalBeforeShippingCoupons: number = 0;
  precioEnvio: number = 0;
  total: number = 0;
  discounts: { [code: string]: number } = {};

  apply_cupon_text = 'Aplicar mi cupón';
  searching_coupon = false;
  precio_productos: number = 0;
  precio_copias: number = 0;
  shippingCostStandard: number = 4.9;
  shippingCostFinal: number = 0;
  shippingCostUrgent: number = 6.4; // Ya no se usa directamente, ahora lo calcula el servicio
  shippingDiscount: number = 0;

  // Premium para envío urgente (la diferencia sobre el estándar)
  private readonly urgentShippingPremium: number = 1.5;

  public itemsPrice: { [id: string]: number } = {};
  public itemsNotes: { [id: string]: string[] } = {};

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
    private orderBuilderService: OrderBuilderService,
    private store: Store
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
      this.total < this.PAYMENT_MINIMUM_PRICE_BIZUM
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
      this.subtotalBeforeShippingCoupons
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
    // Restamos el total de todos los descuentos (copias, productos y envío) del subtotal
    return this.subtotal - this.getTotalDiscounts();
  }

  private getPrecioCopias() {
    this.subtotal = 0;

    return this.pricesService.getOrderPrice(this.copies);
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

  /**
   * Crea el objeto OrderItems con todos los tipos de pedidos
   * @returns Objeto OrderItems con todos los elementos del carrito
   */
  private createOrderItems(): OrderItems {
    return {
      copies: this.copies,
      products: this.products,
      flyers: this.flyers,
      businessCards: this.businessCards,
      folders: this.folders,
      diptychs: this.diptychs,
      triptychs: this.triptychs,
      rollups: this.rollups,
      posters: this.posters,
      magazines: this.magazines,
    };
  }

  public async prepareOrder(callback): Promise<void> {
    this.setLoadingState(true, 'Preparando pedido');

    const order: Order = this.orderBuilderService.buildOrderObject({
      customer: this.customer,
      coupons: this.coupons,
      billing: this.billing,
      shipping: this.shipping,
      differentAddress: this.differentAddress,
      orderItems: this.createOrderItems(),
      payment: this.payment,
      deliver: this.deliver,
      selectedLocation: this.selectedLocation,
    });

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

  /**
   * Calcula los precios del resto de elementos después de obtener el precio de las copias
   * @param precioCopias Precio calculado de las copias
   * @param callback Función a ejecutar al finalizar los cálculos
   */
  private calcularPreciosRestantes(
    precioCopias: number,
    callback = undefined
  ): void {
    // Calculamos precio de productos

    this.precio_productos = this.calcularPrecioProductos();
    // Iniciamos el cálculo de precios para todos los demás elementos
    this.getPrintItemPrices().subscribe({
      next: () => {
        // Calculamos subtotal con todos los elementos
        this.calcularSubtotal(precioCopias, this.precio_productos);

        // Finalizamos los cálculos
        this.finalizarCalculos(callback);
      },
      error: (err) => {
        console.error('Error al calcular los precios de los elementos:', err);
        // Aun con error, calculamos con lo que tenemos
        this.subtotal = precioCopias + this.precio_productos;
        this.finalizarCalculos(callback);
      },
    });
  }

  /**
   * Calcula el precio total de los productos
   */
  private calcularPrecioProductos(): number {
    return this.products.length > 0
      ? this.products
          .map((order) => +order.product.price * order.quantity)
          .reduce((a, b) => a + b, 0)
      : 0;
  }

  /**
   * Calcula el subtotal sumando todos los precios de los elementos
   */
  private calcularSubtotal(
    precioCopias: number,
    precioProductos: number
  ): void {
    this.subtotal = precioCopias + precioProductos;

    // Sumamos los precios de todos los demás tipos de elementos
    Object.values(CartItemType).forEach((itemType) => {
      const propertyName = this.itemTypePropertyMap[itemType];
      // Excluimos productos y copias ya que su precio ya está incluido en el subtotal
      if (
        !propertyName ||
        itemType === CartItemType.PRODUCT ||
        itemType === CartItemType.COPY
      )
        return;

      const items = this[propertyName];
      if (!items || !items.length) return;

      // Sumamos al subtotal los precios de cada tipo de elemento
      const precioItems = items
        .map((item) => this.itemsPrice[item.id] || 0)
        .reduce((a, b) => a + b, 0);

      this.subtotal += precioItems;
    });
  }

  private applyCopiesCouponDiscounts() {
    // Si hay un cupón aplicado y es de tipo 'copies', aplicamos el descuento
    this.coupons.forEach((coupon) => {
      if (coupon.applicability === 'copies') {
        const discount = this.couponHandlerService.getDiscount(
          this.precio_copias,
          coupon
        );
        this.discounts[coupon.code] = discount;
      } else if (
        coupon.applicability !== 'products' &&
        coupon.applicability !== 'shipping'
      ) {
        // Si el tipo no es uno de los conocidos, lo reseteamos
        this.discounts[coupon.code] = 0;
      }
    });
  }

  private applyProductDiscounts() {
    // Si hay un cupón aplicado y es de tipo 'products', aplicamos el descuento
    this.coupons.forEach((coupon) => {
      if (coupon.applicability === 'products') {
        const discount = this.couponHandlerService.getDiscount(
          this.precio_productos,
          coupon
        );
        this.discounts[coupon.code] = discount;
      }
    });
  }

  //     const discounts = {
  //     productsDiscount: 0,
  //     copiesDiscount: 0,
  //     shippingDiscount: 0,
  //   };
  //   if (this.coupons.length > 0) {
  //     const subtotal = this.precio_copias;

  //     if (this.coupons[0].applicability === 'shipping') {
  //       if (this.deliver === 'Shipping') {
  //         discounts.shippingDiscount =
  //           this.shippingCostStandard / ((100 - this.coupons[0].amount) / 100) -
  //           this.shippingCostStandard;
  //       } else if (this.deliver === 'UrgentShipping') {
  //         const realPrice =
  //           this.shippingCostStandard / ((100 - this.coupons[0].amount) / 100) +
  //           1.5;
  //         discounts.shippingDiscount = realPrice - this.shippingCostUrgent;
  //       } else {
  //         discounts.shippingDiscount = 0;
  //       }
  //     } else {
  //       discounts.copiesDiscount = this.couponHandlerService.getDiscount(
  //         subtotal,
  //         this.coupons[0]
  //       );
  //     }
  //   }
  //   return discounts;
  // }

  private applyShippingCouponDiscounts() {
    // Si hay un cupón aplicado y es de tipo 'shipping', aplicamos el descuento
    this.coupons.forEach((coupon) => {
      if (coupon.applicability === 'shipping') {
        if (coupon.discount_type === 'percent') {
          const originalEstandardCost = this.shippingCostStandard;
          const originalUrgentCost = this.shippingCostUrgent;

          const reducedStandardCost =
            originalEstandardCost * (1 - coupon.amount / 100);
          const reducedUrgentCost =
            originalUrgentCost * (1 - coupon.amount / 100);

          if (this.deliver === 'Shipping') {
            this.discounts[coupon.code] =
              originalEstandardCost - reducedStandardCost;
          } else if (this.deliver === 'UrgentShipping') {
            this.discounts[coupon.code] =
              originalUrgentCost - reducedUrgentCost;
          } else {
            // Si no es envío estándar ni urgente, no aplicamos descuento
            this.discounts[coupon.code] = 0;
          }
        } else if (coupon.discount_type === 'fixed_cart') {
          const originalEstandardCost = this.shippingCostStandard;
          const originalUrgentCost = this.shippingCostUrgent;

          const reducedStandardCost = originalEstandardCost - coupon.amount;
          const reducedUrgentCost = originalUrgentCost - coupon.amount;

          if (this.deliver === 'Shipping') {
            this.discounts[coupon.code] =
              originalEstandardCost - reducedStandardCost;
          } else if (this.deliver === 'UrgentShipping') {
            this.discounts[coupon.code] =
              originalUrgentCost - reducedUrgentCost;
          } else {
            // Si no es envío estándar ni urgente, no aplicamos descuento
            this.discounts[coupon.code] = 0;
          }
        }
      }
    });
  }

  private getTotalDiscounts(): number {
    return Object.values(this.discounts).reduce((a, b) => a + b, 0);
  }

  /**
   * Calcula el total de descuentos solo para productos y copias (excluyendo envíos)
   */
  private getNonShippingDiscounts(): number {
    let total = 0;
    this.coupons.forEach((coupon) => {
      if (
        coupon.applicability === 'copies' ||
        coupon.applicability === 'products'
      ) {
        total += this.discounts[coupon.code] || 0;
      }
    });
    return total;
  }

  /**
   * Calcula el total de descuentos solo para gastos de envío
   */
  private getShippingDiscounts(): number {
    let total = 0;
    this.coupons.forEach((coupon) => {
      if (coupon.applicability === 'shipping') {
        total += this.discounts[coupon.code] || 0;
      }
    });
    return total;
  }

  /**
   * Finaliza los cálculos del pedido aplicando descuentos y calculando gastos de envío
   */
  private finalizarCalculos(callback = undefined): void {
    // 1. Aplicamos descuentos de productos y copias
    this.applyCopiesCouponDiscounts();
    this.applyProductDiscounts();

    // 2. Calculamos el subtotal antes de aplicar descuentos de envío
    // Solo restamos los descuentos de productos y copias, no de envío
    this.subtotalBeforeShippingCoupons =
      this.subtotal - this.getNonShippingDiscounts();

    // 3. Calculamos los gastos de envío basados en el subtotal ya con descuentos de productos/copias
    this.calculateGastosDeEnvioEstandar();

    // 4. Revisamos si el subtotal es suficiente para los métodos de pago disponibles
    if (this.subtotalBeforeShippingCoupons < this.PAYMENT_MINIMUM_PRICE_BIZUM) {
      this.payment = 'CARD';
      this.infoPagoAnalytics();
    }
    if (this.subtotalBeforeShippingCoupons < this.PAYMENT_MINIMUM_PRICE_CARD) {
      this.payment = null;
    }

    // 5. Aplicamos descuentos de envío después de calcular los gastos de envío
    this.applyShippingCouponDiscounts();

    // 6. Calculamos el costo final de envío según el método seleccionado
    this.shippingCostFinal =
      this.shippingHandlerService.calculateFinalShippingCost(
        this.deliver,
        this.shippingCostStandard,
        this.shippingCostUrgent
      );

    // 7. Calculamos el total final
    this.getTotal();

    if (callback) {
      callback();
    }
  }

  /**
   * Calcula los gastos de envío basado en el método de entrega seleccionado
   */
  getGastosDeEnvio() {
    // Siempre calculamos los gastos de envío estándar para tener el costo actualizado
    // independientemente del método de entrega seleccionado
    this.calculateGastosDeEnvioEstandar();

    this.shippingCostFinal =
      this.shippingHandlerService.calculateFinalShippingCost(
        this.deliver,
        this.shippingCostStandard,
        this.shippingCostUrgent
      );

    return this.shippingCostFinal;
  }

  /**
   * Calcula la fecha estimada de entrega utilizando el servicio de envío
   */
  calculateExpectedDeliveryDate() {
    this.expectedDeliveryDate =
      this.shippingHandlerService.calculateExpectedDeliveryDate();
  }

  /**
   * Actualiza los elementos del carrito con los valores actuales
   */
  private updateCartItems(cart: Cart) {
    this.copies = cart.copies || [];
    this.products = cart.products || [];
    this.businessCards = cart.bussinessCard || [];
    this.flyers = cart.flyers || [];
    this.folders = cart.folders || [];
    this.diptychs = cart.diptychs || [];
    this.triptychs = cart.triptychs || [];
    this.rollups = cart.rollups || [];
    // Los posters y magazines no están en la interfaz Cart, pero mantenemos el array vacío
    this.posters = [];
    this.magazines = [];
  }

  /**
   * Calcula el total de elementos en el carrito
   */
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

  /**
   * Verifica si el carrito está vacío
   */
  public isCartEmpty(): boolean {
    return this.getTotalCartItems() === 0;
  }

  /**
   * Método que se ejecuta al destruir el componente
   */
  public ngOnDestroy(): void {
    if (this.subcriptorCoupon) {
      this.subcriptorCoupon.unsubscribe();
    }
    if (this.subscriptionCart) {
      this.subscriptionCart.unsubscribe();
    }
  }

  public removeCoupon(coupon: Coupon) {
    this.coupons = [];
    this.couponHandlerService.removeCoupon(coupon);
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
      this.coupons = [coupon];
    }

    return result;
  }

  /**
   * Calcula el precio total del pedido
   * @param callback Función callback que se ejecuta al finalizar todos los cálculos
   */
  calcularPrecios(callback = undefined) {
    // Primero obtenemos el precio de las copias
    this.getPrecioCopias().subscribe({
      next: (price) => {
        this.precio_copias = price;
        this.calcularPreciosRestantes(price, callback);
      },
      error: (err) => {
        console.error('Error al calcular el precio de las copias:', err);
        // Intentamos continuar con precio 0 para copias
        this.precio_copias = 0;
        this.calcularPreciosRestantes(0, callback);
      },
    });
  }

  /**
   * Método que se ejecuta al inicializar el componente
   */
  ngOnInit(): void {
    this.updateCartItems(this.shopcartService.getCart());
    this.subcriptorCoupon = this.couponHandlerService.subscribeCoupons(
      (coupons: Coupon[]) => {
        this.discounts = {};
        this.coupons = coupons;
        this.calcularPrecios(() => {});
      }
    );
    this.calculateExpectedDeliveryDate();

    this.subscriptionCart = this.shopcartService
      .getCart$()
      .subscribe((order) => {
        this.updateCartItems(this.shopcartService.getCart());

        this.calcularPrecios(() => {});
      });
  }
}
