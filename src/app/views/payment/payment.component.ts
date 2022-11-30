import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OrderComponent } from 'src/app/components/order/order.component';
import BillingDetails from 'src/app/interfaces/BillingDetails';
import Location from 'src/app/interfaces/Location';
import Order from 'src/app/interfaces/Order';
import { OrderItem } from 'src/app/interfaces/OrderItem';
import RedsysData from 'src/app/interfaces/RedsysData';
import ShippingDetails from 'src/app/interfaces/ShippingDetails';
import { BillingService } from 'src/app/services/billing.service';
import { OrdersService } from 'src/app/services/orders.service';
import { RedsysService } from 'src/app/services/redsys.service';
import { ShippingService } from 'src/app/services/shipping.service';
import { ShopcartService } from 'src/app/services/shopcart.service';
import locations from 'src/config/locations';
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
  @ViewChild('order') public order: OrderComponent;
  @ViewChild('redsysForm') redsysForm;

  constructor(
    private shopcartService: ShopcartService,
    private billingService: BillingService,
    private shippingService: ShippingService,
    private orderService: OrdersService,
    private redsysService: RedsysService,
    private messageService: MessageService
  ) {
    this.resetBillingDetails();
    this.resetShippingDetails();
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
      first_name: 'Luis',
      company: '53769423T',
      responsible: '',
      address_1: 'Calle la Niña',
      address_2: '2F',
      city: 'Mairena del Aljarafe',
      email: 'luisgonzalezseco@gmail.com',
      phone: '616466098',
      others: '',
      postcode: '41927',
      state: 'Sevilla',
    };
  }

  public validate() {
    this.billingDetailsErrors = this.billingService.validate(
      this.billingDetails
    );
    const billingFine = Object.values(this.billingDetailsErrors).every(
      (x) => !!!x
    );
    if (!!!billingFine) {
      return this.messageService.add({
        severity: 'error',
        detail: 'Hay errores en los "DETALLES DE FACTURACIÓN"',
        summary: 'Error',
      });
    }

    if (this.differentAddress) {
      this.shippingDetailsErrors = this.shippingService.validate(
        this.shippingDetails
      );
      const shippingFine = Object.values(this.shippingDetailsErrors).every(
        (x) => !!!x
      );
      if (!!!shippingFine) {
        return this.messageService.add({
          severity: 'error',
          detail: 'Hay errores en los "DATOS DE ENVÍO"',
          summary: 'Error',
        });
      }
    }

    if (!!!this.termsAccepted) {
      return this.messageService.add({
        severity: 'error',
        detail: 'Debes aceptar los términos y condiciones',
        summary: 'Error',
      });
    }
  }

  public loadRedsys(order, callback) {
    this.redsysService
      .sendPayment(order)
      .subscribe((redsysData: RedsysData) => {
        this.redsysData = redsysData;
        return callback();
      });
  }

  public getTotal() {
    let priceShipping = this.deliver === 'Shipping' ? 5 : 0;
    return (
      this.orders.map(this.orderService.getPrecio).reduce((a, b) => a + b, 0) +
      priceShipping
    );
  }

  public sent($event) {
    $event.preventDefault();
    this.prepareOrder((err, order) => {
      this.loadRedsys(order, () => {
        this.redsysForm.nativeElement.submit();
      });
    });
  }

  public prepareOrder(callback) {
    let shippingLine = {} as any;
    if (this.deliver === 'Pickup') {
      this.setPickupProperties(shippingLine);
    } else {
      this.setShippingProperties(shippingLine);
    }
    const order: Order = {
      billing: this.billingDetails,
      shipping: this.shippingDetails,
      line_items: this.orders,
      payment_method: this.payment,
      payment_method_title: this.payment,
      shipping_lines: [shippingLine],
    };

    this.orderService.create(order).subscribe((response: any) => {
      const orderID = response.order;
      order.id = orderID;
      callback(null, order);
    });
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
    this.shippingDetails = {
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
