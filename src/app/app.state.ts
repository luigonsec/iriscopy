// app.state.ts

import Coupon from './interfaces/Coupon';
import Customer from './interfaces/Customer';

export interface AppState {
  customer: CustomerState;
}

export interface CustomerState {
  customer: Customer | null;
  error: any;
}

export interface CouponState {
  coupons: Coupon[];
}
