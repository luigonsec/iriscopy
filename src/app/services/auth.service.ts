import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(options: { username: string; password: string }) {
    return this.http.post(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/auth`,
      { username: options.username, password: options.password }
    );
  }
}
