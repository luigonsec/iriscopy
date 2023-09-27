// loading.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as CouponsActions from '../_actions/coupons.actions';
import Coupon from '../interfaces/Coupon';

export interface State {
  coupon: Coupon;
}

const coupon = localStorage.getItem('coupon');
export const initialState: State = {
	coupon: coupon ? JSON.parse(coupon) : null,
};

export const couponsReducer = createReducer(
	initialState,
	on(CouponsActions.applyCoupon, (state, { coupon }) => {
		localStorage.setItem('coupon', JSON.stringify(coupon));
		return {
			...state,
			coupon,
		};
	}),

	on(CouponsActions.clearCoupon, (state) => {
		localStorage.removeItem('coupon');
		return {
			...state,
			coupon: undefined,
		};
	})
);
