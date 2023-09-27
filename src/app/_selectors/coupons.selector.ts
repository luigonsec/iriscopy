// customer.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CouponState } from '../app.state';

export const selectCouponState = createFeatureSelector<CouponState>('coupon');

export const selectCoupon = createSelector(
	selectCouponState,
	(state: CouponState) => {
		return state.coupon;
	}
);
