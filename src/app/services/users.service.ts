import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  forgotPassword(email: string) {
    return this.http.post(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/users/forgot-password`,
      { email }
    );
  }

  resetPassword(token: string, password: string) {
    return this.http.post(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/users/reset-password`,
      { token, password }
    );
  }

  modifyPassword(customer_id: number, password: string) {
    return this.http.post(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/users/${customer_id}/modify-password`,
      { password }
    );
  }
}
