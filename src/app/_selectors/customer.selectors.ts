// customer.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CustomerState } from '../app.state';

export const selectCustomerState =
  createFeatureSelector<CustomerState>('customer');

export const selectCustomer = createSelector(
	selectCustomerState,
	(state: CustomerState) => state.customer
);

export const selectLoginFailure = createSelector(
	selectCustomerState,
	(state: CustomerState) => {
		return state.error;
	}
);
