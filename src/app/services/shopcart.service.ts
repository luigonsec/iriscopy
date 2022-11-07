import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OrderItem } from '../interfaces/OrderItem';

@Injectable({
  providedIn: 'root',
})
export class ShopcartService {
  private itemCart$: Subject<OrderItem[]>;

  constructor() {
    this.itemCart$ = new Subject();
  }

  addToCart(order: OrderItem) {
    const cart: OrderItem[] = this.getCart();
    cart.push(order);
    this.itemCart$.next(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  remove(order: OrderItem) {
    const cart: OrderItem[] = this.getCart();
    const filteredCart = cart.filter((x) => x.id !== order.id);
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    this.itemCart$.next(filteredCart);
  }

  getCart(): OrderItem[] {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    this.itemCart$.next([]);
  }

  public getCart$(): Observable<OrderItem[]> {
    return this.itemCart$.asObservable();
  }
}
