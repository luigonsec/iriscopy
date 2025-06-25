export default interface Coupon {
  id: number;
  code: string;
  discount_type: 'percent' | 'fixed_cart';
  amount: number;
  minimum_amount: number;
  maximum_amount: number;
  valid_until?: number;
  applicability: 'all' | 'products' | 'copies' | 'shipping';
}
