import BillingDetails from './BillingDetails';
import { OrderItem } from './OrderItem';
import ShippingDetails from './ShippingDetails';
import ShippingLine from './ShippingLine';

export default interface Order {
  id?: number;
  billing: BillingDetails;
  shipping: ShippingDetails;
  payment_method: string;
  payment_method_title: string;
  line_items: OrderItem[];
  shipping_lines: ShippingLine[];
  meta_data?: any;
}
