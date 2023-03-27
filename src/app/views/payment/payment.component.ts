import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import { OrderComponent } from 'src/app/components/order/order.component';
import BillingDetails from 'src/app/interfaces/BillingDetails';
import Coupon from 'src/app/interfaces/Coupon';
import File from 'src/app/interfaces/File';
import Location from 'src/app/interfaces/Location';
import Order from 'src/app/interfaces/Order';
import { OrderItem } from 'src/app/interfaces/OrderItem';
import RedsysData from 'src/app/interfaces/RedsysData';
import ShippingDetails from 'src/app/interfaces/ShippingDetails';
import { BillingService } from 'src/app/services/billing.service';
import { CouponsService } from 'src/app/services/coupons.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OrdersService } from 'src/app/services/orders.service';
import { RedsysService } from 'src/app/services/redsys.service';
import { ShippingService } from 'src/app/services/shipping.service';
import { ShopcartService } from 'src/app/services/shopcart.service';
import locations from 'src/config/locations';
import { environment } from 'src/environments/environment';
import { LoginComponent } from '../login/login.component';
import { selectCoupon } from 'src/app/_selectors/coupons.selector';
import { applyCoupon } from 'src/app/_actions/coupons.actions';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  public emptyCart: boolean = false;

  public billingDetails: BillingDetails = {} as BillingDetails;
  public billingDetailsErrors: BillingDetails = {} as BillingDetails;

  public shippingDetails: ShippingDetails = {} as ShippingDetails;
  public shippingDetailsErrors: ShippingDetails = {} as ShippingDetails;

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

  public formGroup;

  constructor(
    private shopcartService: ShopcartService,
    private billingService: BillingService,
    private shippingService: ShippingService,
    private orderService: OrdersService,
    private redsysService: RedsysService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private couponsService: CouponsService,

    private store: Store
  ) {
    this.resetBillingDetails();
    this.resetShippingDetails();
    this.store.select(selectCustomer).subscribe((data) => {
      if (data) {
        this.billingDetails = Object.assign({}, data.billing);
        this.shippingDetails = Object.assign({}, data.shipping);
      }
    });

    this.store.select(selectCoupon).subscribe((coupon) => {
      if (coupon) {
        this.coupon = coupon;
      }
    });
  }

  public validateCoupon() {
    this.couponsService
      .validate(this.inputCoupon)
      .subscribe((coupon: Coupon) => {
        this.coupon = coupon;
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
      });
  }

  public copyAddress($event) {
    const differentAddress = $event.checked;
    if (!!!differentAddress) {
      this.shippingDetails = Object.assign({}, this.billingDetails);
    } else {
      this.resetShippingDetails();
    }
  }

  public resetBillingDetails() {
    this.billingDetails = {
      first_name: '',
      company: '',
      responsible: '',
      address_1: '',
      address_2: '',
      city: '',
      email: '',
      phone: '',
      others: '',
      postcode: '',
      state: '',
    };
  }

  public validate() {
    const validBilling = this.validBilling();
    if (!!!validBilling)
      return this.messageService.add({
        severity: 'error',
        detail: 'Hay errores en los "DETALLES DE FACTURACIÓN"',
        summary: 'Error',
      });

    if (this.differentAddress) {
      const validShipping = this.validShipping();
      if (!!!validShipping) {
        return this.messageService.add({
          severity: 'error',
          detail: 'Hay errores en los "DATOS DE ENVÍO"',
          summary: 'Error',
        });
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

  private validShipping() {
    this.shippingDetailsErrors = this.shippingService.validate(
      this.shippingDetails
    );
    const shippingFine = Object.values(this.shippingDetailsErrors).every(
      (x) => !!!x
    );
    return shippingFine;
  }

  private validBilling() {
    this.billingDetailsErrors = this.billingService.validate(
      this.billingDetails
    );
    const billingFine = Object.values(this.billingDetailsErrors).every(
      (x) => !!!x
    );
    return billingFine;
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
    // Obtener el subtotal usando la función getSubtotal
    const subtotal = this.getSubtotal();

    // Verificar si existe un cupón
    if (this.coupon) {
      let discountAmount;

      // Calcular el monto del descuento en función del tipo de descuento
      if (this.coupon.discountType === 'percentage') {
        discountAmount = subtotal * (this.coupon.amount / 100);
      } else {
        discountAmount = this.coupon.amount;
      }

      return discountAmount;
    }

    // Si no hay cupón, el descuento es 0
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

  public prepareOrder(callback) {
    this.loadingService.setLoading({
      isLoading: true,
      text: 'Preparando pedido',
    });
    let shippingLine = {} as any;
    if (this.deliver === 'Pickup') {
      this.setPickupProperties(shippingLine);
    } else {
      this.setShippingProperties(shippingLine);
    }
    const flattenFiles = this.orders
      .map((order) => order.files)
      .reduce((acc, val) => acc.concat(val), []);
    const order: Order = {
      coupon: this.coupon,
      billing: this.billingDetails,
      shipping: this.shippingDetails,
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

    this.orderService.create(order).subscribe(
      (response: any) => {
        const orderID = response.order;
        this.OrderID = orderID;
        order.id = orderID;
        return callback(null, order);
      },
      (err) => {
        this.loadingService.setLoading({
          isLoading: false,
        });
        return callback(err);
      }
    );
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

  public resetShippingDetails() {
    this.shippingDetails = this.shippingDetails || {
      first_name: '',
      company: '',
      responsible: '',
      address_1: '',
      address_2: '',
      city: '',
      email: '',
      phone: '',
      others: '',
      postcode: '',
      state: '',
    };
  }

  ngOnInit(): void {
    this.orders = this.shopcartService.getCart();
    this.emptyCart = this.orders.length === 0;
    this.shopcartService.getCart$().subscribe((orders) => {
      this.emptyCart = orders.length === 0;
    });
  }
}
