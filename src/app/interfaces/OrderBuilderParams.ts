import Customer from './Customer';
import Coupon from './Coupon';
import Location from './Location';
import { BillingComponent } from '../components/forms/billing/billing.component';
import { ShippingComponent } from '../components/forms/shipping/shipping.component';
import { OrderItems } from './OrderItems';

export interface OrderBuilderParams {
  customer: Customer;
  coupons: Coupon[];
  billing: BillingComponent;
  shipping: ShippingComponent;
  differentAddress: boolean;
  orderItems: OrderItems;
  payment: string;
  deliver: string;
  selectedLocation: Location;
}
