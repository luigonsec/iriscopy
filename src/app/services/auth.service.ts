import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

interface SuccessAuthResponse {
  expiresAt: number;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public refreshTokenTimeout;

  constructor(private http: HttpClient) {}

  isLoggedIn() {
    return !!localStorage.getItem('customer');
  }

  login(options: { username: string; password: string }) {
    return this.http.post(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/auth`,
      { username: options.username, password: options.password }
    );
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return this.stopRefreshTokenTimer();
    }
    return this.http
      .post(
        `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/auth/refresh`,
        { refreshToken }
      )
      .subscribe(
        (response: SuccessAuthResponse) => {
          localStorage.setItem('expiresAt', response.expiresAt.toString());
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.startRefreshTokenTimer(response.expiresAt);
        },
        (err) => {
          localStorage.removeItem('expiresAt');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('accessToken');
          this.stopRefreshTokenTimer();
        }
      );
  }

  public startRefreshTokenTimer(expiresAt: number) {
    const diff = expiresAt - Date.now();
    const millisencondsToRefresh = diff - 10 * 1000;
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken();
    }, millisencondsToRefresh);
  }

  public stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) clearTimeout(this.refreshTokenTimeout);
  }
}
