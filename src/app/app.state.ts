// app.state.ts

import Customer from './interfaces/Customer';

export interface AppState {
  customer: CustomerState;
}

export interface CustomerState {
  customer: Customer | null;
}
