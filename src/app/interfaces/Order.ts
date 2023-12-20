import BillingDetails from './BillingDetails';
import Coupon from './Coupon';
import { OrderCopy } from './OrderCopy';
import OrderProduct from './OrderProduct';
import ShippingDetails from './ShippingDetails';
import ShippingLine from './ShippingLine';

export default interface Order {
  id?: number;
  coupon?: Coupon;
  billing: BillingDetails;
  shipping: ShippingDetails;
  payment_method: string;
  payment_method_title: string;
  copies: OrderCopy[];
  products: OrderProduct[];
  shipping_lines: ShippingLine[];
  meta_data?;
}
