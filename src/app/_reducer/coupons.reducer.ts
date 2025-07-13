// loading.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as CouponsActions from '../_actions/coupons.actions';
import Coupon from '../interfaces/Coupon';

export interface State {
  coupons: Coupon[];
}

const coupon = localStorage.getItem('coupons');
export const initialState: State = {
  coupons: coupon ? JSON.parse(coupon) : [],
};

export const couponsReducer = createReducer(
  initialState,
  on(CouponsActions.applyCoupon, (state, { coupon }) => {
    const existingCoupons = state.coupons || [];
    // Check if the coupon already exists in the state
    if (
      existingCoupons.some(
        (existingCoupon) => existingCoupon.code === coupon.code
      )
    ) {
      // If it exists, return the current state without modification
      return state;
    }
    // If it doesn't exist, add the new coupon to the state
    const updatedCoupons = [...existingCoupons, coupon];
    // Save the updated coupons to localStorage
    localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
    return {
      ...state,
      coupons: updatedCoupons,
    };
  }),

  on(CouponsActions.clearCoupon, (state, { coupon }) => {
    const coupons = state.coupons || [];
    const updatedCoupons = coupons.filter(
      (existingCoupon) => existingCoupon.code !== coupon.code
    );
    // Save the updated coupons to localStorage
    localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
    return {
      ...state,
      coupons: updatedCoupons,
    };
  }),

  on(CouponsActions.clearCoupons, (state) => {
    // Clear the coupons from localStorage
    localStorage.removeItem('coupons');
    return {
      ...state,
      coupons: [],
    };
  })
);
