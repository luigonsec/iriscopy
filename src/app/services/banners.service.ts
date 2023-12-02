import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Banner from '../interfaces/Banner';

@Injectable({
  providedIn: 'root',
})
export class BannersService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Banner[]>(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/banners`
    );
  }

  create(banner: Banner) {
    return this.http.post(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/banners`,
      {
        banner,
      }
    );
  }

  delete(id: number) {
    return this.http.delete(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/banners/${id}`
    );
  }

  update(banner: Banner) {
    return this.http.patch(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/banners/${banner.id}`,
      {
        banner,
      }
    );
  }
}
