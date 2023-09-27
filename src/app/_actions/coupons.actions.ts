// customer.actions.ts
import { createAction, props } from '@ngrx/store';
import Coupon from '../interfaces/Coupon';

export const applyCoupon = createAction(
	'[Coupon] apply',
	props<{ coupon: Coupon }>()
);

export const clearCoupon = createAction('[Coupon] clear');
