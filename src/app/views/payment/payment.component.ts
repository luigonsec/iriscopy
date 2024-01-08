import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { OrderComponent } from 'src/app/components/order/order.component';
import Coupon from 'src/app/interfaces/Coupon';
import File from 'src/app/interfaces/File';
import Location from 'src/app/interfaces/Location';
import Order from 'src/app/interfaces/Order';
import { OrderItem } from 'src/app/interfaces/OrderItem';
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
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import Customer from 'src/app/interfaces/Customer';
import aljarafe from 'src/config/aljarafe';
import mallorca from 'src/config/mallorca';
import menorca from 'src/config/menorca';
import ibiza from 'src/config/ibiza';
import formentera from 'src/config/formentera';

import sevilla from 'src/config/sevilla';
import ShippingDetails from 'src/app/interfaces/ShippingDetails';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  public emptyCart: boolean = false;

  public inputCoupon: string;
  public coupon: Coupon;

  public differentAddress = false;
  public payment: string;
  public deliver: string = 'Pickup';
  public orders: OrderItem[];
  public locations = locations;
  public selectedLocation: Location;
  public termsAccepted: boolean;
  public redsysData: RedsysData = {
    Ds_MerchantParameters: undefined,
    Ds_Signature: undefined,
    Ds_SignatureVersion: undefined,
  };

  public OrderID;
  @ViewChild('order') public order: OrderComponent;
  @ViewChild('redsysForm') redsysForm;

  @ViewChild('billing') public billing: BillingComponent;
  @ViewChild('shipping') public shipping: ShippingComponent;

  public formGroup;
  public customer: Customer;
  public subcriptorCustomer: Subscription;
  public subcriptorCoupon: Subscription;
  public subscriptionCart: Subscription;

  constructor(
    private shopcartService: ShopcartService,
    private orderService: OrdersService,
    private redsysService: RedsysService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private couponsService: CouponsService,

    private store: Store
  ) {
    this.subcriptorCustomer = this.store
      .select(selectCustomer)
      .subscribe((customer) => {
        if (customer) {
          this.customer = customer;
        }
      });

    // this.subcriptorCoupon = this.store
    //   .select(selectCoupon)
    //   .subscribe((coupon) => {
    //     if (coupon) {
    //       this.coupon = coupon;
    //     }
    //   });

    this.store.dispatch(clearCoupon());
  }

  public ngOnDestroy(): void {
    this.subcriptorCustomer.unsubscribe();
    this.subcriptorCoupon.unsubscribe();
  }

  public getCoupon() {
    this.couponsService.validate(this.inputCoupon).subscribe({
      next: (coupon: Coupon) => {
        this.coupon = coupon;
        this.validateCoupon();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          detail: 'El código promocional no existe',
          summary: 'Código erróneo',
        });
      },
    });
  }

  private checkMinimumAmount() {
    if (!this.coupon) return true;
    if (this.coupon.minimum_amount > this.getSubtotal()) {
      this.messageService.add({
        severity: 'error',
        detail: `El código promocional solo puede aplicarse a pedidos mayores de ${this.coupon.minimum_amount} €`,
        summary: 'Código no aplicado',
      });
      this.coupon = undefined;
      return false;
    }
    return true;
  }

  public validateCoupon() {
    const isValidAmount = this.checkMinimumAmount();
    if (!isValidAmount) return false;

    this.store.dispatch(applyCoupon({ coupon: this.coupon }));
    this.messageService.add({
      severity: 'success',
      detail: 'El código promocional se ha aplicado',
      summary: 'Código aplicado',
    });
    const subtotal = this.getSubtotalWithDiscount();
    if (subtotal < 3) {
      this.payment = 'Card';
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
    if (!['Bizum', 'Card'].includes(this.payment)) {
      return this.messageService.add({
        severity: 'error',
        detail: 'Debes indicar un "Método de pago"',
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

  public startPayment__Card(order, callback) {
    this.loadingService.setLoading({
      isLoading: true,
      text: 'Redirigiendo a pasarela de pago',
    });
    this.redsysService.sendPayment(order, false).subscribe(
      (redsysData: RedsysData) => {
        this.redsysData = redsysData;
        return callback();
      },
      () => {
        this.loadingService.setLoading({
          isLoading: false,
        });
      }
    );
  }

  public startPayment__Bizum(order, callback) {
    this.loadingService.setLoading({
      isLoading: true,
      text: 'Redirigiendo a pasarela de pago',
    });
    this.redsysService.sendPayment(order, true).subscribe(
      (redsysData: RedsysData) => {
        this.redsysData = redsysData;
        return callback();
      },
      () => {
        this.loadingService.setLoading({
          isLoading: false,
        });
      }
    );
  }

  public getPrecioEnvio() {
    let precioEnvio = 4.9;

    if (this.getSubtotal() >= 40) precioEnvio = 0;

    if (this.billing) {
      let code;
      if (this.differentAddress && this.shipping) {
        code = this.shipping.shippingDetails.postcode;
      } else {
        code = this.billing.billingDetails.postcode;
      }

      const numericCode = +code;
      if (
        (numericCode >= 35000 && numericCode < 36000) ||
        (numericCode >= 38000 && numericCode < 39000)
      ) {
        precioEnvio = this.getGastosEnvioCanarias();
      }

      if (aljarafe.includes(numericCode))
        precioEnvio = this.getGastosEnvioAljarafe();
      if (sevilla.includes(numericCode))
        precioEnvio = this.getGastosEnvioSevilla();
      if (mallorca.includes(numericCode))
        precioEnvio = this.getGastosEnvioMallorca();
      if (ibiza.includes(numericCode)) precioEnvio = this.getGastosEnvioIbiza();
      if (menorca.includes(numericCode))
        precioEnvio = this.getGastosEnvioMenorca();
      if (formentera.includes(numericCode))
        precioEnvio = this.getGastosEnvioFormentera();
    }
    return precioEnvio;
  }

  public getGastosEnvioCanarias() {
    return 35;
  }

  public getGastosEnvioAljarafe() {
    const precioPedido = this.getSubtotal();
    if (precioPedido > 0 && precioPedido < 10) return 4.9;
    if (precioPedido >= 10 && precioPedido < 25) return 3.9;
    if (precioPedido >= 25 && precioPedido < 40) return 2.9;
    if (precioPedido >= 40) return 0;
    return 4.9;
  }

  public getGastosEnvioSevilla() {
    const precioPedido = this.getSubtotal();
    if (precioPedido > 0 && precioPedido < 10) return 4.9;
    if (precioPedido >= 10 && precioPedido < 25) return 1.9;
    if (precioPedido >= 25 && precioPedido < 40) return 0.9;
    if (precioPedido >= 40) return 0;
    return 4.9;
  }

  public getGastosEnvioMallorca() {
    return 10.3;
  }

  public getGastosEnvioMenorca() {
    return 11.9;
  }

  public getGastosEnvioIbiza() {
    return 11.9;
  }

  public getGastosEnvioFormentera() {
    return 14.4;
  }

  public getTotal() {
    const priceShipping =
      this.deliver === 'Shipping' ? this.getPrecioEnvio() : 0;
    return this.getSubtotalWithDiscount() + priceShipping;
  }

  public getSubtotalWithDiscount() {
    return this.getSubtotal() - this.getDiscount();
  }

  private getSubtotal() {
    return this.orders
      .map((order) => this.orderService.getPrecio(order, this.orders))
      .reduce((a, b) => a + b, 0);
  }

  public getDiscount(): number {
    const subtotal = this.getSubtotal();

    if (this.coupon) {
      let discountAmount = 0;

      if (this.coupon.discount_type === 'percent') {
        discountAmount = subtotal * (this.coupon.amount / 100);
      } else if (this.coupon.discount_type === 'fixed_cart') {
        discountAmount = this.coupon.amount;
      }
      return discountAmount;
    }
    return 0;
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
      switch (this.payment) {
        case 'Bizum': {
          this.startPayment__Bizum(order, () => {
            setTimeout(() => this.redsysForm.nativeElement.submit());
          });
          break;
        }
        case 'Card': {
          this.startPayment__Card(order, () => {
            setTimeout(() => this.redsysForm.nativeElement.submit());
          });
          break;
        }
      }
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
    return this.orders
      .map((order) => order.files)
      .reduce((acc, val) => acc.concat(val), []);
  }

  private buildOrderObject(shippingLine, flattenFiles: File[]): Order {
    return {
      coupon: this.coupon,
      billing: this.billing.billingDetails,
      shipping: this.differentAddress
        ? this.shipping.shippingDetails
        : this.billing.billingDetails,
      line_items: this.orders,
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
    shippingLine.method_title = 'Envío en 48 horas';
    shippingLine.method_id = 'flat_rate';
    shippingLine.instance_id = '9';
    // shippingLine.total = this.getPrecioEnvio().toFixed(2);
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

  ngOnInit(): void {
    this.orders = this.shopcartService.getCart();
    this.emptyCart = this.orders.length === 0;
    this.subscriptionCart = this.shopcartService
      .getCart$()
      .subscribe((orders) => {
        this.orders = orders;
        this.checkMinimumAmount();
        this.emptyCart = orders.length === 0;
      });
  }
}
