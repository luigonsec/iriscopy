import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderCopy } from '../interfaces/OrderCopy';
import { environment } from 'src/environments/environment';
import precios from 'src/config/prices';
import { Subject } from 'rxjs';
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

  /**
   * Computes the total price for an order item, taking into account the print type, form, paper size and grammage, binding options, and number of copies.
   * @param {OrderCopy} order - The order item to calculate the price for.
   * @returns {number} The total price of the order item.
   */
  getCopyPrice(order: OrderCopy, completeOrder: OrderCopy[]): number {
    // Verificar si hay archivos en el pedido
    if (!order || !order.files || !order.files.length) {
      return 0; // Si no hay archivos, el precio es 0
    }

    // Objeto para almacenar el recuento total de páginas por tipo de impresión, formato de impresión y tamaño de papel
    const totalPages = {};

    // Iterar sobre cada pedido completo en la lista de pedidos
    completeOrder.forEach((order) => {
      // Obtener el tipo de impresión y el tamaño del papel del pedido actual
      const printType = order.printType.code;
      const paperSize = order.paperSize.code;

      // Calcular el número de páginas para cada archivo en el pedido
      const orderSides =
        order.files.reduce((totalFilePages, file) => {
          // Calcular el número de páginas por archivo teniendo en cuenta la cantidad de páginas por lado
          const filePages = Math.ceil(file.pages * order.pagesPerSide.factor);
          return totalFilePages + filePages; // Sumar las páginas del archivo al total del pedido
        }, 0) * order.copiesQuantity; // Multiplicar por la cantidad de copias del pedido

      // Determinar el código de formulario de impresión (una-cara o doble-cara) basado en el número de páginas
      const printFormCode =
        orderSides === 1 ? 'una-cara' : order.printForm.code;

      // Actualizar el objeto totalPages con el recuento de páginas para este pedido
      if (!(printType in totalPages)) totalPages[printType] = {};
      if (!(printFormCode in totalPages[printType]))
        totalPages[printType][printFormCode] = {};
      if (!(paperSize in totalPages[printType][printFormCode]))
        totalPages[printType][printFormCode][paperSize] = 0;
      totalPages[printType][printFormCode][paperSize] += orderSides;
    });

    // Calcular el precio de los acabados
    let boundPrice = 0;
    let boundColors = 0;
    if (order.finishType.code === 'encuadernado') {
      boundPrice += order.finishType.factor || 0;
      boundColors += order.boundColors.anillas.factor || 0;
      boundColors += order.boundColors.trasera.factor || 0;
      boundColors += order.boundColors.delantera.factor || 0;
    }

    // Calcular el total de encuadernaciones necesarias
    const totalBounds =
      order.boundType.code === 'agrupados'
        ? 1
        : order.files.length * order.copiesQuantity;

    // Calcular el precio total por pedido
    const totalPricePerOrder = order.files.reduce((total, file) => {
      // Calcular el número de páginas y lados por archivo
      const sides = Math.ceil(file.pages * order.pagesPerSide.factor);
      const pages = Math.ceil(
        file.pages * order.pagesPerSide.factor * order.printForm.factor
      );

      let finishTypePrice = 0;
      // Calcular el precio del acabado (si es plastificado)
      if (order.finishType.code === 'plastificado') {
        finishTypePrice +=
          order.finishType[`factor_${order.paperSize.code}`] * pages;
      }

      // Determinar el código de formulario de impresión (una-cara o doble-cara) basado en el número de páginas
      const printFormCode = sides === 1 ? 'una-cara' : order.printForm.code;

      // Obtener el precio por página del tipo de impresión, formulario de impresión y tamaño de papel
      const pricePerPage = precios[order.printType.code][printFormCode][
        order.paperSize.code
      ](totalPages[order.printType.code][printFormCode][order.paperSize.code]);

      // Calcular el precio final por archivo
      const finalPrice =
        order.copiesQuantity *
        (pricePerPage * sides +
          order.paperGrammage[`factor_${order.paperSize.code}`] * pages +
          finishTypePrice);

      return total + finalPrice; // Sumar el precio final al total
    }, 0);

    // Calcular el precio total de los acabados
    const boundPrices = totalBounds * (boundPrice + boundColors);

    // Devolver el precio total redondeado a dos decimales
    return parseFloat((totalPricePerOrder + boundPrices).toFixed(2));
  }
}
