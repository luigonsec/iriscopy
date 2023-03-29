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
import { selectCoupon } from 'src/app/_selectors/coupons.selector';
import { applyCoupon } from 'src/app/_actions/coupons.actions';
import { BillingComponent } from 'src/app/components/forms/billing/billing.component';
import { ShippingComponent } from 'src/app/components/forms/shipping/shipping.component';
import { Subscription } from 'rxjs';

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
  public deliver: string = 'Shipping';
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
  public subscription: Subscription;

  constructor(
    private shopcartService: ShopcartService,
    private orderService: OrdersService,
    private redsysService: RedsysService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private couponsService: CouponsService,

    private store: Store
  ) {
    this.store.select(selectCoupon).subscribe((coupon) => {
      if (coupon) {
        this.coupon = coupon;
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    if (!!!this.coupon) return true;
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
    if (!!!isValidAmount) return false;

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
    if (!!!validBilling) return;

    if (this.differentAddress) {
      const validShipping = this.shipping.validate();
      if (!!!validShipping) {
        return;
      }
    }

    if (this.deliver === 'Pickup' && !!!this.selectedLocation) {
      return this.messageService.add({
        severity: 'error',
        detail: 'Debes seleccionar un local de recogida',
        summary: 'Error',
      });
    }
    if (!!!['Bizum', 'Card'].includes(this.payment)) {
      return this.messageService.add({
        severity: 'error',
        detail: 'Debes indicar un "Método de pago"',
        summary: 'Error',
      });
    }

    if (!!!this.termsAccepted) {
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
      (err) => {
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
      (err) => {
        this.loadingService.setLoading({
          isLoading: false,
        });
      }
    );
  }

  public getTotal() {
    let priceShipping = this.deliver === 'Shipping' ? 5 : 0;
    return this.getSubtotalWithDiscount() + priceShipping;
  }

  public getSubtotalWithDiscount() {
    return this.getSubtotal() - this.getDiscount();
  }

  private getSubtotal() {
    return this.orders
      .map((order) => this.orderService.getPrecio(order))
      .reduce((a, b) => a + b, 0);
  }

  public getDiscount(): number {
    const subtotal = this.getSubtotal();

    if (this.coupon) {
      let discountAmount;

      if (this.coupon.discount_type === 'percent') {
        discountAmount = subtotal * (this.coupon.amount / 100);
      } else {
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
            setTimeout((_) => this.redsysForm.nativeElement.submit());
          });
          break;
        }
        case 'Card': {
          this.startPayment__Card(order, () => {
            setTimeout((_) => this.redsysForm.nativeElement.submit());
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
      next: (response: any) => {
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

  private getShippingLine(): any {
    let shippingLine = {} as any;

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

  private buildOrderObject(shippingLine: any, flattenFiles: File[]): Order {
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
              quantity: flattenFiles.map((x) => '1'),
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

  private setShippingProperties(shippingLine: any) {
    shippingLine.method_title = 'Envío en 48 horas';
    shippingLine.method_id = 'flat_rate';
    shippingLine.instance_id = '9';
    shippingLine.total = '5.00';
    shippingLine.total_tax = '0.00';
  }

  private setPickupProperties(shippingLine: any) {
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
    this.subscription = this.shopcartService.getCart$().subscribe((orders) => {
      this.orders = orders;
      this.checkMinimumAmount();
      this.emptyCart = orders.length === 0;
    });
  }
}
