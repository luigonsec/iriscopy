import { OrderCopy } from './OrderCopy';
import OrderProduct from './OrderProduct';

export default interface Cart {
  copies: OrderCopy[];
  products: OrderProduct[];
}
