import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderCopy } from '../interfaces/OrderCopy';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import TarjetaVisita from '../interfaces/TarjetaVisita';
import Flyer from '../interfaces/Flyer';
import Carpeta from '../interfaces/Carpeta';
import Rollup from '../interfaces/Rollup';
import Diptico from '../interfaces/Diptico';
import Triptico from '../interfaces/Triptico';
import { PriceResult } from '../interfaces/PriceResult';
import CartItem from '../interfaces/CartItem';
import { CartItemType } from './shopcart.service';
import Cartel from '../interfaces/Cartel';
import Revista from '../interfaces/Revista';

@Injectable({
  providedIn: 'root',
})
export class PricesService {
  constructor(private http: HttpClient) {}

  /**
   * Método genérico para obtener precios de cualquier tipo de elemento
   * @param itemType Tipo de elemento del que se quiere obtener el precio
   * @param item El elemento del que se quiere obtener el precio
   */
  getItemPrice<T>(itemType: CartItemType, item: T): Observable<PriceResult> {
    let endpoint: string;
    let payload: any = item;

    switch (itemType) {
      case CartItemType.COPY:
        endpoint = 'print/line';
        payload = { line: item, order: [] }; // Ajustar según las necesidades
        break;
      case CartItemType.BUSINESS_CARD:
        endpoint = 'business-card';
        break;
      case CartItemType.FLYER:
        endpoint = 'flyer';
        break;
      case CartItemType.FOLDER:
        endpoint = 'folder';
        break;
      case CartItemType.DIPTYCH:
        endpoint = 'diptych';
        break;
      case CartItemType.TRIPTYCH:
        endpoint = 'triptych';
        break;
      case CartItemType.ROLLUP:
        endpoint = 'rollup';
        break;
      case CartItemType.POSTER:
        endpoint = 'poster';
        break;
      case CartItemType.MAGAZINE:
        endpoint = 'magazine';
        break;
      default:
        throw new Error(`Tipo de elemento no soportado: ${itemType}`);
    }

    return this.http.post<PriceResult>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/${endpoint}`,
      payload
    );
  }

  getCopyPrice(line: OrderCopy, order: OrderCopy[]): Observable<PriceResult> {
    return this.http.post<PriceResult>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/print/line`,
      { line, order }
    );
  }

  getOrderPrice(order: OrderCopy[]): Observable<number> {
    return this.http.post<number>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/print`,
      { order }
    );
  }

  getBusinessCardPrice(businessCard: TarjetaVisita): Observable<PriceResult> {
    return this.http.post<PriceResult>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/business-card`,
      businessCard
    );
  }

  getFlyerPrice(flyer: Flyer): Observable<PriceResult> {
    return this.http.post<PriceResult>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/flyer`,
      flyer
    );
  }

  getMagazinePrice(magazine: Revista): Observable<PriceResult> {
    return this.http.post<PriceResult>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/magazine`,
      magazine
    );
  }

  getPosterPrice(cartel: Cartel): Observable<PriceResult> {
    return this.http.post<PriceResult>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/poster`,
      cartel
    );
  }

  getFolderPrice(card: Carpeta): Observable<PriceResult> {
    return this.http.post<PriceResult>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/folder`,
      card
    );
  }

  getRollUpPrice(rollup: Rollup): Observable<PriceResult> {
    return this.http.post<PriceResult>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/rollup`,
      rollup
    );
  }

  getDiptychPrice(diptico: Diptico): Observable<PriceResult> {
    return this.http.post<PriceResult>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/diptych`,
      diptico
    );
  }

  getTriptychPrice(triptico: Triptico): Observable<PriceResult> {
    return this.http.post<PriceResult>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/triptych`,
      triptico
    );
  }
}
