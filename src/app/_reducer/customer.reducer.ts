// customer.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  setCustomer,
  setLoading,
  unsetLoading,
} from '../_actions/customer.actions';
import { CustomerState } from 'src/app/app.state';

const customer = localStorage.getItem('irisCopy_app_customer');
export const initialState: CustomerState = {
  customer: customer ? JSON.parse(customer) : null,
  error: null,
};

export const customerReducer = createReducer(
  initialState,
  on(
    loginSuccess,
    (state, { customer, accessToken, refreshToken, expiresAt }) => {
      localStorage.setItem('irisCopy_app_accessToken', accessToken);
      localStorage.setItem('irisCopy_app_refreshToken', refreshToken);
      localStorage.setItem('irisCopy_app_expiresAt', expiresAt);
      if (customer) {
        localStorage.setItem('irisCopy_app_customer', JSON.stringify(customer));
        return { ...state, customer };
      }
      return { ...state };
    }
  ),

  on(setCustomer, (state, { customer }) => {
    localStorage.setItem('irisCopy_app_customer', JSON.stringify(customer));
    return { ...state, customer: customer };
  }),

  on(login, (state) => {
    return { ...state, error: undefined };
  }),

  on(loginFailure, (state, { error }) => {
    return { ...state, error };
  }),

  on(logout, (state) => {
    localStorage.removeItem('irisCopy_app_accessToken');
    localStorage.removeItem('irisCopy_app_refreshToken');
    localStorage.removeItem('irisCopy_app_expiresAt');
    localStorage.removeItem('irisCopy_app_customer');
    return { ...state, customer: null, error: null };
  }),

  on(setLoading, (state, { isLoading }) => ({ ...state, isLoading })),
  on(unsetLoading, (state) => ({ ...state, isLoading: false }))
);
