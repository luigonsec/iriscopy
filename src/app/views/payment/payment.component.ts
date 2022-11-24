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
  public payment: string = 'Card';
  public deliver: string = 'Shipping';
  public orders: OrderItem[];
  public locations = locations;
  public selectedLocation: Location;
  public termsAccepted: boolean;
  public redsysData: RedsysData;
  @ViewChild('order') public order: OrderComponent;

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

    this.prepareOrder();
  }

  public redsys() {
    const request = {
      Ds_SignatureVersion: 'HMAC_SHA256_V1',
      Ds_MerchantParameters:
        'eyJEU19NRVJDSEFOVF9BTU9VTlQiOiAiMTQ1IiwiRFNfTUVSQ0hBTlRfQ1VSUkVOQ1kiOiAiOTc4IiwiRFNfTUVSQ0hBTlRfTUVSQ0hBTlRDT0RFIjogIjk5OTAwODg4MSIsIkRTX01FUkNIQU5UX01FUkNIQU5UVVJMIjogImh0dHA6Ly93d3cucHJ1ZWJhLmNvbS91cmxOb3RpZmljYWNpb24ucGhwIiwiRFNfTUVSQ0hBTlRfT1JERVIiOiAiMTQ0NjA2ODU4MSIsIkRTX01FUkNIQU5UX1RFUk1JTkFMIjogIjEiLCJEU19NRVJDSEFOVF9UUkFOU0FDVElPTlRZUEUiOiAiMCIsIkRTX01FUkNIQU5UX1VSTEtPIjogImh0dHA6Ly93d3cucHJ1ZWJhLmNvbS91cmxLTy5waHAiLCJEU19NRVJDSEFOVF9VUkxPSyI6ICJodHRwOi8vd3d3LnBydWViYS5jb20vdXJsT0sucGhwIn0=',
      Ds_Signature: 'PqV2+SF6asdasMjXasKJRTh3UIYya1hmU/igHkzhC+R=',
    };
    this.redsysService
      .sendPayment(request)
      .subscribe((redsysData: RedsysData) => {
        console.log(redsysData);

        this.redsysData = redsysData;
      });
  }

  public getTotal() {
    let priceShipping = this.deliver === 'Shipping' ? 5 : 0;
    return (
      this.orders.map(this.orderService.getPrecio).reduce((a, b) => a + b, 0) +
      priceShipping
    );
  }

  public prepareOrder() {
    let shippingLine = {} as any;
    if (this.deliver === 'Pickup') {
      shippingLine.method_title = 'Local de Recogida';
      shippingLine.method_id = 'local_pickup_plus';
      shippingLine.total = '0.00';
      shippingLine.meta_data = [
        {
          key: '_pickup_location_id',
          value: this.selectedLocation.id,
        },
      ];
    } else {
      shippingLine.method_title = 'Envío en 48 horas';
      shippingLine.method_id = 'flat_rate';
      shippingLine.instance_id = '9';
      shippingLine.total = '5.00';
      shippingLine.total_tax = '0.00';
    }
    const order: Order = {
      billing: this.billingDetails,
      shipping: this.shippingDetails,
      line_items: this.orders,
      payment_method: this.payment,
      payment_method_title: this.payment,
      shipping_lines: [shippingLine],
    };

    this.orderService.create(order).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Se ha enviado tu pedido',
        detail: 'Pedido recibido',
      });
    });
  }
  //   "shipping_lines": [
  //     {
  //         "id": 2038,
  //         "method_title": "Envío en 48 horas",
  //         "method_id": "flat_rate",
  //         "instance_id": "9",
  //         "total": "5.00",
  //         "total_tax": "0.00",
  //         "taxes": [],
  //         "meta_data": [
  //             {
  //                 "id": 40354,
  //                 "key": "Artículos",
  //                 "value": "CARPETA ANILLAS GRAFOPLAS 4 ANILLAS 25MM POLIPROPILENO CON CREMALLERA I LIKE A+ NEGRA &times; 1"
  //             }
  //         ]
  //     }
  // ],

  //   "shipping_lines": [
  //     {
  //         "method_title": "Local de Recogida",
  //         "method_id": "local_pickup_plus",
  //         "total": "0.00",
  //         "total_tax": "0.00",
  //         "taxes": [],
  //         "meta_data": [
  //             {
  //                 "key": "_pickup_location_id",
  //                 "value": "5209"
  //             }
  //         ]
  //     }
  // ]

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
