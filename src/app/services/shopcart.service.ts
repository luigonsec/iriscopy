import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Order } from '../interfaces/Order';

@Injectable({
  providedIn: 'root',
})
export class ShopcartService {
  private itemCart$: Subject<Order[]>;

  constructor() {
    this.itemCart$ = new Subject();
  }

  addToCart(order: Order) {
    const cart: Order[] = this.getCart();
    cart.push(order);
    this.itemCart$.next(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  remove(order: Order) {
    const cart: Order[] = this.getCart();
    const filteredCart = cart.filter((x) => x.id !== order.id);
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    this.itemCart$.next(filteredCart);
  }

  getCart(): Order[] {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    this.itemCart$.next([]);
  }

  public getCart$(): Observable<Order[]> {
    return this.itemCart$.asObservable();
  }
}
