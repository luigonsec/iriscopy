import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../interfaces/Order';
import { environment } from 'src/environments/environment';
import precios from 'src/config/prices';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  create(order: Order) {
    return this.http.post(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/orders`,
      { order }
    );
  }

  getPrecio(order: Order): number {
    if (order && order.files) {
      const twoSidesFactor = order.printForm.factor;
      const totalPages = order.files
        .map((x) => x.pages)
        .reduce((a, b) => a + b, 0);
      const pages = Math.ceil(
        totalPages * twoSidesFactor * order.pagesPerSide.factor
      );

      const pricePerPage =
        precios[order.printType.code][order.printForm.code][
          order.paperSize.code
        ](pages) + order.paperGrammage.factor;

      let boundPrice = 0;
      const totalBounds =
        order.boundType.code === 'agrupados' ? 1 : order.files.length;

      if (order.finishType.code === 'encuadernado') {
        boundPrice += 1.2;
        boundPrice += order.boundColors.anillas.factor || 0;
        boundPrice += order.boundColors.trasera.factor || 0;
        boundPrice += order.boundColors.delantera.factor || 0;
      }

      const price =
        order.copiesQuantity *
        (pricePerPage * pages + boundPrice * totalBounds);
      return parseFloat(price.toFixed(2));
    }
  }
}
