import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ShippingDetails from '../interfaces/ShippingDetails';
import BillingDetails from '../interfaces/BillingDetails';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { setCustomer } from '../_actions/customer.actions';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private store: Store
  ) {}

  register(customer: any) {
    return this.http.post(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/customers/`,
      { customer }
    );
  }

  update(
    id: number,
    data: { shipping?: ShippingDetails; billing?: BillingDetails }
  ) {
    const jwt = localStorage.getItem('jwt');
    return this.http
      .patch(
        `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/customers/${id}`,
        {
          shipping: data.shipping,
          billing: data.billing,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .pipe(
        tap((res: any) => {
          const customer = res.user;
          this.store.dispatch(setCustomer({ customer }));
        })
      );
  }
}
