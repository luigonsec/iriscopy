export default interface Coupon {
  id: number;
  code: string;
  discount_type: 'percent' | 'amount';
  amount: number;
  minimum_amount: number;
  maximum_amount: number;
}
