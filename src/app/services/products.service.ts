import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}
  getByCategory(category) {
    return this.http.get(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/products/category/${category}`
    );
  }

  getAll() {
    return this.http.get(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/products`
    );
  }

  getVariations(id: number) {
    return this.http.get(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/products/${id}/variations`
    );
  }
}
