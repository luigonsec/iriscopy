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

const customer = localStorage.getItem('customer');
export const initialState: CustomerState = {
  customer: customer ? JSON.parse(customer) : null,
  error: null,
};

export const customerReducer = createReducer(
  initialState,
  on(
    loginSuccess,
    (state, { customer, accessToken, refreshToken, expiresAt }) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('expiresAt', expiresAt);
      localStorage.setItem('customer', JSON.stringify(customer));
      return { ...state, customer };
    }
  ),

  on(setCustomer, (state, { customer }) => {
    localStorage.setItem('customer', JSON.stringify(customer));
    return { ...state, customer: customer };
  }),

  on(login, (state) => {
    return { ...state, error: undefined };
  }),

  on(loginFailure, (state, { error }) => {
    return { ...state, error };
  }),

  on(logout, (state) => ({ ...state, customer: null, error: null })),

  on(setLoading, (state, { isLoading }) => ({ ...state, isLoading })),
  on(unsetLoading, (state) => ({ ...state, isLoading: false }))
);
