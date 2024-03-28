import Product from './Product';
import ProductVariation from './ProductVariation';

export default interface OrderProduct {
  product: Product;
  variation?: ProductVariation;
  quantity: number;
}
