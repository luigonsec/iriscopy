import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import Loading from '../interfaces/Loading';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: Loading = {
    isLoading: false,
    text: '',
  };
  private loading$: Subject<Loading>;
  constructor() {
    this.loading$ = new Subject();
  }

  isLoading$() {
    return this.loading$;
  }

  setLoading(payload: Loading) {
    this.loading = payload;
    return this.loading$.next(this.loading);
  }

  isLoading() {
    return this.loading;
  }
}
