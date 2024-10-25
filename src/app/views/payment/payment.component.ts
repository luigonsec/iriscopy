import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { OrderComponent } from 'src/app/components/order/order.component';
import Location from 'src/app/interfaces/Location';
import RedsysData from 'src/app/interfaces/RedsysData';

import { ShopcartService } from 'src/app/services/shopcart.service';
import locations from 'src/config/locations';
import { BillingComponent } from 'src/app/components/forms/billing/billing.component';
import { ShippingComponent } from 'src/app/components/forms/shipping/shipping.component';
import { Subscription } from 'rxjs';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import Customer from 'src/app/interfaces/Customer';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import OrderProduct from 'src/app/interfaces/OrderProduct';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  public emptyCart: boolean = false;
  public differentAddress = false;
  public deliver: string = 'Pickup';
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

  public OrderID;
  @ViewChild('order') public order: OrderComponent;
  @ViewChild('billing') public billing: BillingComponent;
  @ViewChild('shipping') public shipping: ShippingComponent;

  public customer: Customer;
  public subcriptorCustomer: Subscription;
  public subscriptionCart: Subscription;

  constructor(private shopcartService: ShopcartService, private store: Store) {
    this.subcriptorCustomer = this.store
      .select(selectCustomer)
      .subscribe((customer) => {
        if (customer) {
          this.customer = customer;
        }
      });
  }

  public updateDeliveryMethod(deliver: string) {
    this.deliver = deliver;
  }

  public ngOnDestroy(): void {
    this.subcriptorCustomer.unsubscribe();
    this.subscriptionCart.unsubscribe();
  }

  ngOnInit(): void {
    this.copies = this.shopcartService.getCart().copies;
    this.products = this.shopcartService.getCart().products;
    this.emptyCart = this.copies.length + this.products.length === 0;

    this.subscriptionCart = this.shopcartService
      .getCart$()
      .subscribe((order) => {
        this.copies = order.copies;
        this.products = order.products;
        this.emptyCart = this.copies.length + this.products.length === 0;
      });
  }
}
