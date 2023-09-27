// customer.actions.ts
import { createAction, props } from '@ngrx/store';
import Customer from '../interfaces/Customer';

export const login = createAction(
	'[Customer] Login',
	props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
	'[Customer] Login Success',
	props<{ customer: Customer; jwt: string }>()
);

export const setCustomer = createAction(
	'[Customer] Set customer',
	props<{ customer: Customer }>()
);

export const loginFailure = createAction(
	'[Customer] Login Failure',
	props<{ error: any }>()
);

export const logout = createAction('[Customer] Logout');

export const setLoading = createAction(
	'[Loading] Set Loading',
	props<{ isLoading: boolean }>()
);
export const unsetLoading = createAction('[Loading] Unset Loading');
