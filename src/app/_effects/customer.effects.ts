// customer.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
} from '../_actions/customer.actions';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import Customer from '../interfaces/Customer';

@Injectable()
export class CustomerEffects {
  public login$;
  public logout$;

  constructor(
    private actions$: Actions,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(login),
        tap(() =>
          this.loadingService.setLoading({
            isLoading: true,
            text: 'Iniciando sesión...',
          })
        ),
        mergeMap(({ username, password }) =>
          this.authService.login({ username, password }).pipe(
            map((data: any) => {
              console.log(data);

              return loginSuccess({ customer: data.user, jwt: data.jwt });
            }),
            catchError((error) => {
              this.loadingService.setLoading({ isLoading: false });
              return of(loginFailure({ error }));
            }),
            tap(() => this.loadingService.setLoading({ isLoading: false }))
          )
        )
      )
    );

    this.logout$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(logout),
          tap(() => {
            localStorage.removeItem('jwt');
            localStorage.removeItem('customer');
          })
        ),
      { dispatch: false }
    );
  }
}
