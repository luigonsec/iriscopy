import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import Coupon from 'src/app/interfaces/Coupon';
import File from 'src/app/interfaces/File';
import Location from 'src/app/interfaces/Location';
import Order from 'src/app/interfaces/Order';
import RedsysData from 'src/app/interfaces/RedsysData';

import { CouponsService } from 'src/app/services/coupons.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OrdersService } from 'src/app/services/orders.service';
import { RedsysService } from 'src/app/services/redsys.service';
import { ShopcartService } from 'src/app/services/shopcart.service';
import locations from 'src/config/locations';
import { applyCoupon, clearCoupon } from 'src/app/_actions/coupons.actions';
import { BillingComponent } from 'src/app/components/forms/billing/billing.component';
import { ShippingComponent } from 'src/app/components/forms/shipping/shipping.component';
import { Subscription } from 'rxjs';
import Customer from 'src/app/interfaces/Customer';

import generalConfig from 'src/config/general';

import ShippingDetails from 'src/app/interfaces/ShippingDetails';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import OrderProduct from 'src/app/interfaces/OrderProduct';
import { HttpErrorResponse } from '@angular/common/http';
import { selectCoupon } from 'src/app/_selectors/coupons.selector';
import { ShippingCostsService } from 'src/app/services/shipping-costs.service';
import moment from 'moment';
import { AnalyticsService } from 'src/app/services/analytics.service';

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
  public copies: OrderCopy[];
  public products: OrderProduct[];
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

  constructor(
    private shopcartService: ShopcartService,
    private orderService: OrdersService,
    private redsysService: RedsysService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private couponsService: CouponsService,
    private shippingCostService: ShippingCostsService,
    private analytics: AnalyticsService,
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

  public removeCoupon() {
    this.coupon = undefined;
    this.store.dispatch(clearCoupon());
  }

  public getCoupon() {
    this.first_time_coupon_applied = true;
    this.searching_coupon = true;
    this.apply_cupon_text = 'Buscando cupón...';
    this.couponsService
      .validate(this.inputCoupon)
      .subscribe({
        next: (coupon: Coupon) => {
          coupon.valid_until = moment().valueOf() + 15 * 60 * 1000;

          this.store.dispatch(applyCoupon({ coupon: coupon }));
        },
        error: () => {
          return this.messageService.add({
            severity: 'error',
            detail: 'El código promocional no existe',
            summary: 'Código erróneo',
          });
        },
      })
      .add(() => {
        this.searching_coupon = false;
        this.apply_cupon_text = 'Aplicar mi cupón';
      });
  }

  private comprobarCantidadMinima(coupon: Coupon) {
    if (coupon.minimum_amount > this.precio_copias) {
      return false;
    }
    return true;
  }

  public clearCoupon() {
    this.store.dispatch(clearCoupon());
    this.coupon = undefined;
  }

  public validateCoupon(coupon) {
    if (!coupon) return false;

    if (!this.comprobarCantidadMinima(coupon)) {
      this.messageService.add({
        severity: 'error',
        detail: `El código promocional solo puede aplicarse a pedidos de copias mayores de ${coupon.minimum_amount} €`,
        summary: 'Código no aplicado',
      });
      return this.clearCoupon();
    } else if (coupon.valid_until < moment().valueOf()) {
      return this.clearCoupon();
    }

    this.coupon = coupon;
    this.discount = this.coupon.amount;

    this.store.dispatch(applyCoupon({ coupon: coupon }));
    this.calcularPrecios();

    if (this.first_time_coupon_applied) {
      this.messageService.add({
        severity: 'success',
        detail: 'El código promocional se ha aplicado',
        summary: 'Código aplicado',
      });
    }
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
    if (this.billing) {
      const postcode =
        this.differentAddress && this.shipping
          ? this.shipping.shippingDetails.postcode
          : this.billing.billingDetails.postcode;

      this.shippingCostStandard = this.shippingCostService.getGastosDeEnvio(
        this.subtotal - this.discount,
        postcode
      );
      return;
    }
    this.shippingCostStandard = 4.9;
  }

  public getTotal() {
    this.total = this.getSubtotalWithDiscount() + this.shippingCostFinal;
  }

  public getSubtotalWithDiscount() {
    return this.subtotal - this.discount;
  }

  private getPrecioCopias() {
    this.subtotal = 0;

    return this.orderService.getOrderPrice(this.copies);
  }

  public getDiscount() {
    const subtotal = this.precio_copias;
    this.discount = 0;
    if (this.coupon) {
      let discountAmount = 0;

      if (this.coupon.discount_type === 'percent') {
        discountAmount = subtotal * (this.coupon.amount / 100);
      } else if (this.coupon.discount_type === 'fixed_cart') {
        discountAmount = this.coupon.amount;
      }
      this.discount = discountAmount;
    }
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

    const shippingLine = this.getShippingLine();
    const flattenFiles = this.getFlattenFiles();
    const order: Order = this.buildOrderObject(shippingLine, flattenFiles);

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

  private getShippingLine(): ShippingDetails {
    const shippingLine = {} as ShippingDetails;

    if (this.deliver === 'Pickup') {
      this.setPickupProperties(shippingLine);
    } else {
      this.setShippingProperties(shippingLine);
    }

    return shippingLine;
  }

  private getFlattenFiles(): File[] {
    return this.copies
      .map((order) => order.files)
      .reduce((acc, val) => acc.concat(val), []);
  }

  private buildOrderObject(shippingLine, flattenFiles: File[]): Order {
    const customer_id = this.customer ? this.customer.id : 0;
    return {
      customer_id,
      coupon: this.coupon,
      billing: this.billing.billingDetails,
      shipping: this.differentAddress
        ? this.shipping.shippingDetails
        : this.billing.billingDetails,
      copies: this.copies,
      products: this.products,
      payment_method: this.payment,
      payment_method_title: this.payment,
      shipping_lines: [shippingLine],
      meta_data: [
        {
          key: '_wcuf_uploaded_files',
          value: {
            '0-37198-37595': {
              id: '0-37198-37595',
              quantity: flattenFiles.map(() => '1'),
              original_filename: flattenFiles.map(
                (x: File) => x.original_filename
              ),
              url: flattenFiles.map((x: File) => x.url),
              source: flattenFiles.map((x: File) => x.source),
              num_uploaded_files: flattenFiles.length,
              user_feedback: '',
              is_multiple_file_upload: true,
            },
          },
        },
      ],
    };
  }

  private setShippingProperties(shippingLine) {
    shippingLine.method_title =
      this.deliver == 'UrgentShipping' ? 'Envío urgente' : 'Envío en 48 horas';
    shippingLine.method_id =
      this.deliver == 'UrgentShipping' ? 'urgent_flat_rate' : 'flat_rate';
    shippingLine.instance_id = '9';
    // shippingLine.total = this.getGastosDeEnvio().toFixed(2);
    shippingLine.total_tax = '0.00';
  }

  private setPickupProperties(shippingLine) {
    shippingLine.method_title = 'Local de Recogida';
    shippingLine.method_id = 'local_pickup_plus';
    shippingLine.total = '0.00';
    shippingLine.meta_data = [
      {
        key: '_pickup_location_id',
        value: this.selectedLocation.id,
      },
    ];
  }

  handleDeliveryMethodChange() {
    this.updateDeliveryMethod(this.deliver);
    this.calcularPrecios();
  }

  calcularPrecios(callback = undefined) {
    this.getPrecioCopias().subscribe((price) => {
      this.precio_copias = price;
      this.subtotal =
        price +
        this.products
          .map((order) => +order.product.price * order.quantity)
          .reduce((a, b) => a + b, 0);
      this.getDiscount();
      this.comprobarMetodoDePago();
      this.getGastosDeEnvio();
      this.getTotal();
      if (callback) {
        callback();
      }
    });
  }

  getGastosDeEnvio() {
    if (this.deliver === 'Pickup') {
      this.shippingCostFinal = 0;
    } else if (this.deliver === 'Shipping') {
      this.calculateGastosDeEnvioEstandar();
      this.shippingCostFinal = this.shippingCostStandard;
    } else if (this.deliver === 'UrgentShipping') {
      this.shippingCostFinal = this.shippingCostUrgent;
    }
    return this.shippingCostFinal;
  }

  private addWorkingDays(
    date: moment.Moment,
    workingDays: number
  ): moment.Moment {
    const result = date.clone();
    while (workingDays > 0) {
      result.add(1, 'day');
      // Con isoWeekday(), de lunes (1) a viernes (5) son días laborables.
      if (result.isoWeekday() <= 5) {
        workingDays--;
      }
    }
    return result;
  }

  calculateExpectedDeliveryDate() {
    // Asegurarse de que Moment use el locale en español
    moment.locale('es');

    const today = moment();
    const earliest = this.addWorkingDays(today, 2);
    const latest = this.addWorkingDays(today, 4);

    // Formateamos la salida para mostrar abreviaturas en minúsculas (por ejemplo, 'vie 9' en vez de 'Vie 9')
    // Nota: Para obtener las abreviaturas en minúsculas, puedes transformar el string resultante a minúsculas.
    this.expectedDeliveryDate = `${earliest
      .format('ddd D')
      .toLowerCase()} - ${latest.format('ddd D').toLowerCase()}`;
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
    this.subcriptorCoupon = this.store
      .select(selectCoupon)
      .subscribe((coupon) => {
        this.validateCoupon(coupon);
      });
  }

  public ngOnDestroy(): void {
    this.subcriptorCoupon.unsubscribe();
  }

  ngOnInit(): void {
    this.copies = this.shopcartService.getCart().copies;
    this.products = this.shopcartService.getCart().products;
    this.calcularPrecios(this.subscribeCoupon.bind(this));
    this.calculateExpectedDeliveryDate();
    this.subscriptionCart = this.shopcartService
      .getCart$()
      .subscribe((order) => {
        this.copies = order.copies;
        this.products = order.products;
        this.calcularPrecios(this.validateCoupon.bind(this, this.coupon));
      });
  }
}
