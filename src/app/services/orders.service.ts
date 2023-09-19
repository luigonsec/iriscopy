import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderItem } from '../interfaces/OrderItem';
import { environment } from 'src/environments/environment';
import precios from 'src/config/prices';
import { Subject } from 'rxjs';
import Order from '../interfaces/Order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private order$: Subject<OrderItem>;
  constructor(private http: HttpClient) {
    this.order$ = new Subject();
  }

  create(order: Order) {
    return this.http.post(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/orders`,
      { order }
    );
  }

  edit(order: OrderItem) {
    this.order$.next(order);
  }

  getOrder() {
    return this.order$;
  }

  /**
   * Computes the total price for an order item, taking into account the print type, form, paper size and grammage, binding options, and number of copies.
   * @param {OrderItem} order - The order item to calculate the price for.
   * @returns {number} The total price of the order item.
   */
  getPrecio(order: OrderItem, completeOrder: OrderItem[]): number {
    if (!order || !order.files) {
      return 0;
    }

    const totalPages = completeOrder.reduce((totalOrderPages, order) => {
      const orderSidesFactor = order.printForm.factor;

      const orderPages =
        order.files.reduce((totalFilePages, file) => {
          const filePages = Math.ceil(
            file.pages * orderSidesFactor * order.pagesPerSide.factor
          );
          return totalFilePages + filePages;
        }, 0) * order.copiesQuantity;

      return totalOrderPages + orderPages;
    }, 0);

    const twoSidesFactor = order.printForm.factor;
    let boundPrice = 0;
    let boundColors = 0;
    if (order.finishType.code === 'encuadernado') {
      boundPrice += 1.2;
      boundColors += order.boundColors.anillas.factor || 0;
      boundColors += order.boundColors.trasera.factor || 0;
      boundColors += order.boundColors.delantera.factor || 0;
    }
    const totalBounds =
      order.boundType.code === 'agrupados' ? 1 : order.files.length;
    return parseFloat(
      order.files
        .reduce((total, file) => {
          const pages = Math.ceil(
            file.pages * twoSidesFactor * order.pagesPerSide.factor
          );
          const printFormCode =
            file.pages === 1 ? 'una-cara' : order.printForm.code;
          const pricePerPage =
            precios[order.printType.code][printFormCode][order.paperSize.code](
              totalPages
            ) + order.paperGrammage.factor;
          const price =
            order.copiesQuantity *
            (pricePerPage * pages + boundPrice * totalBounds + boundColors);
          return total + price;
        }, 0)
        .toFixed(2)
    );
  }
}
