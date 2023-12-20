import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  config$: Subject<unknown>;

  constructor(private http: HttpClient) {
    this.config$ = new Subject();
  }

  getConfig() {
    return this.http
      .get(
        `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/config`,
        {}
      )
      .pipe(
        tap((config) => {
          this.config$.next(config);
        })
      );
  }

  listenConfig() {
    this.config$.asObservable();
  }

  updateConfig(config) {
    return this.http.patch(
      `${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/config`,
      config
    );
  }
}
