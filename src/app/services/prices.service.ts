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

@Injectable({
  providedIn: 'root',
})
export class PricesService {
  constructor(private http: HttpClient) {}

  getCopyPrice(
    line: OrderCopy,
    order: OrderCopy[]
  ): Observable<{ precio: number; notas: string[] }> {
    return this.http.post<{ precio: number; notas: string[] }>(
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

  getBusinessCardPrice(
    card: TarjetaVisita
  ): Observable<{ precio: number; notas: string[] }> {
    return this.http.post<{ precio: number; notas: string[] }>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/business-card`,
      card
    );
  }

  getFlyerPrice(card: Flyer): Observable<{ precio: number; notas: string[] }> {
    return this.http.post<{ precio: number; notas: string[] }>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/flyer`,
      card
    );
  }

  getFolderPrice(
    card: Carpeta
  ): Observable<{ precio: number; notas: string[] }> {
    return this.http.post<{ precio: number; notas: string[] }>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/folder`,
      card
    );
  }

  getRollUpPrice(
    rollup: Rollup
  ): Observable<{ precio: number; notas: string[] }> {
    return this.http.post<{ precio: number; notas: string[] }>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/rollup`,
      rollup
    );
  }

  getDiptychPrice(
    diptico: Diptico
  ): Observable<{ precio: number; notas: string[] }> {
    return this.http.post<{ precio: number; notas: string[] }>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/diptych`,
      diptico
    );
  }

  getTriptychPrice(
    triptico: Triptico
  ): Observable<{ precio: number; notas: string[] }> {
    return this.http.post<{ precio: number; notas: string[] }>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/prices/triptych`,
      triptico
    );
  }
}
