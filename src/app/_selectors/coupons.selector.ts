// customer.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CouponState } from '../app.state';

export const selectCouponState = createFeatureSelector<CouponState>('coupons');

export const selectCoupon = createSelector(
  selectCouponState,
  (state: CouponState) => {
    return state.coupons;
  }
);
