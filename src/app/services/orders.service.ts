import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderCopy } from '../interfaces/OrderCopy';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import Order from '../interfaces/Order';
import OrderProduct from '../interfaces/OrderProduct';
import { PricesService } from './prices.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private order$: Subject<OrderCopy>;
  private orderToEdit: OrderCopy;

  constructor(private http: HttpClient, private pricesService: PricesService) {
    this.order$ = new Subject();
  }

  async orderCopyToAnalytics(order: OrderCopy, copies: OrderCopy[]) {
    const precio = (
      await this.pricesService.getCopyPrice(order, copies).toPromise()
    ).precio;
    return {
      item_name: 'Impresión',
      item_id: 1,
      price: +precio,
      item_brand: 'Iris Copy',
      item_category: 'Impresiones',
      quantity: order.copiesQuantity,
    };
  }

  orderProductToAnalytics(order: OrderProduct) {
    return {
      item_name: order.product.name,
      item_id: 1,
      price: order.product.price,
      item_brand: 'Iris Copy',
      item_category: order.product.categories[0].name,
      quantity: order.quantity,
    };
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

  getByCustomer(customers_id: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/orders/customers/${customers_id}`
    );
  }
}
