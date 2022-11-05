import { Component, OnInit } from '@angular/core';
import BillingDetails from 'src/app/interfaces/BillingDetails';
import { Order } from 'src/app/interfaces/Order';
import ShipmentDetails from 'src/app/interfaces/ShipmentDetails';
import { ShopcartService } from 'src/app/services/shopcart.service';
import locations from 'src/config/locations';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  public billingDetails: BillingDetails = {} as BillingDetails;
  public shipmentDetails: ShipmentDetails = {} as ShipmentDetails;
  public sameAddress = false;
  public payment: string;
  public deliver: string = 'Shipment';
  public orders: Order[];
  public locations = locations;
  selectedLocation;

  constructor(private shopcartService: ShopcartService) {
    this.resetBillingDetails();
    this.resetShipmentDetails();
  }

  public copyAddress($event) {
    const differentAddress = $event.checked;
    if (!!!differentAddress) {
      this.shipmentDetails = Object.assign({}, this.billingDetails);
    } else {
      this.resetShipmentDetails();
    }
  }

  public resetBillingDetails() {
    this.billingDetails = {
      name: '',
      cif: '',
      responsible: '',
      address: '',
      address2: '',
      city: '',
      email: '',
      phone: '',
      others: '',
      postalcode: '',
      province: '',
    };
  }

  public resetShipmentDetails() {
    this.shipmentDetails = {
      name: '',
      cif: '',
      responsible: '',
      address: '',
      address2: '',
      city: '',
      email: '',
      phone: '',
      others: '',
      postalcode: '',
      province: '',
    };
  }

  ngOnInit(): void {
    this.orders = this.shopcartService.getCart();
  }
}
