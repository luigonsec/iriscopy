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
    if (!order || !order.files || !order.files.length) {
      return 0;
    }

    const totalPages = {};

    completeOrder.forEach((order) => {
      const printType = order.printType.code;
      const paperSize = order.paperSize.code;

      const orderSides =
        order.files.reduce((totalFilePages, file) => {
          const filePages = Math.ceil(file.pages * order.pagesPerSide.factor);
          return totalFilePages + filePages;
        }, 0) * order.copiesQuantity;

      const printFormCode =
        orderSides === 1 ? 'una-cara' : order.printForm.code;

      if (!(printType in totalPages)) totalPages[printType] = {};
      if (!(printFormCode in totalPages[printType]))
        totalPages[printType][printFormCode] = {};
      if (!(paperSize in totalPages[printType][printFormCode]))
        totalPages[printType][printFormCode][paperSize] = 0;
      totalPages[printType][printFormCode][paperSize] += orderSides;
    }, 0);

    let boundPrice = 0;
    let boundColors = 0;
    boundPrice += order.finishType.factor || 0;
    if (order.finishType.code === 'encuadernado') {
      boundColors += order.boundColors.anillas.factor || 0;
      boundColors += order.boundColors.trasera.factor || 0;
      boundColors += order.boundColors.delantera.factor || 0;
    }
    const totalBounds =
      order.boundType.code === 'agrupados'
        ? 1
        : order.files.length * order.copiesQuantity;
    const totalPricePerOrder = order.files.reduce((total, file) => {
      const sides = Math.ceil(file.pages * order.pagesPerSide.factor);
      const pages = Math.ceil(
        file.pages * order.pagesPerSide.factor * order.printForm.factor
      );

      const printFormCode = sides === 1 ? 'una-cara' : order.printForm.code;

      const pricePerPage = precios[order.printType.code][printFormCode][
        order.paperSize.code
      ](totalPages[order.printType.code][printFormCode][order.paperSize.code]);

      const finalPrice =
        order.copiesQuantity *
        (pricePerPage * sides + order.paperGrammage.factor * pages);
      return total + finalPrice;
    }, 0);
    const boundPrices = totalBounds * (boundPrice + boundColors);
    return parseFloat((totalPricePerOrder + boundPrices).toFixed(2));
  }
}
