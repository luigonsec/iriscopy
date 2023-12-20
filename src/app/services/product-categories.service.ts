import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import ProductCategory from '../interfaces/ProductCategory';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoriesService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<ProductCategory[]>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/product-categories`,
      {}
    );
  }

  update(category: ProductCategory, body: { active: boolean }) {
    return this.http.patch(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/product-categories/${category.id}`,
      body
    );
  }
}
