import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { loginSuccess, logout } from '../_actions/customer.actions';

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

  constructor(private http: HttpClient, private store: Store) {}

  isLoggedIn() {
    return !!localStorage.getItem('irisCopy_app_customer');
  }

  login(options: { username: string; password: string }) {
    return this.http.post(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/auth`,
      { username: options.username, password: options.password }
    );
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('irisCopy_app_refreshToken');

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
          this.store.dispatch(
            loginSuccess({
              customer: undefined,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              expiresAt: response.expiresAt.toString(),
            })
          );
          this.startRefreshTokenTimer(response.expiresAt);
        },
        (err) => {
          this.store.dispatch(logout());
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
