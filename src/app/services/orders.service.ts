import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderCopy } from '../interfaces/OrderCopy';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import Order from '../interfaces/Order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private order$: Subject<OrderCopy>;
  private orderToEdit: OrderCopy;

  constructor(private http: HttpClient) {
    this.order$ = new Subject();
  }

  create(order: Order) {
    return this.http.post(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/orders`,
      { order }
    );
  }

  setOrderToEdit(order: OrderCopy) {
    this.orderToEdit = order;
  }

  getOrderToEdit() {
    const orderToEdit = this.orderToEdit;
    //this.orderToEdit = undefined;
    return orderToEdit;
  }

  edit(order: OrderCopy) {
    this.order$.next(order);
  }

  getOrder() {
    return this.order$;
  }

  getCopyPrice(line: OrderCopy, order: OrderCopy[]): Observable<number> {
    return this.http.post<number>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/orders/price/line`,
      { line, order }
    );
  }

  getOrderPrice(order: OrderCopy[]): Observable<number> {
    return this.http.post<number>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/orders/price`,
      { order }
    );
  }

  getByCustomer(customers_id: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/orders/customers/${customers_id}`
    );
  }
}
