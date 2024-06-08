import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OrderCopy } from '../interfaces/OrderCopy';
import Cart from '../interfaces/Cart';
import OrderProduct from '../interfaces/OrderProduct';
import JSONfn from 'json-fn';

@Injectable({
  providedIn: 'root',
})
export class ShopcartService {
  private itemCart$: Subject<Cart>;

  constructor() {
    this.itemCart$ = new Subject();
  }

  addCopyToCart(order: OrderCopy) {
    const cart: Cart = this.getCart();
    cart.copies.push(order);
    this.itemCart$.next(cart);
    localStorage.setItem('cart', JSONfn.stringify(cart));
  }

  addProductToCart(order: OrderProduct) {
    const cart: Cart = this.getCart();
    cart.products.push(order);
    this.itemCart$.next(cart);
    localStorage.setItem('cart', JSONfn.stringify(cart));
  }

  updateCopies(orders: OrderCopy[]) {
    const cart = this.getCart();
    cart.copies = orders;
    localStorage.setItem('cart', JSONfn.stringify(cart));
    this.itemCart$.next(cart);
  }

  removeCopy(order: OrderCopy) {
    const cart: Cart = this.getCart();
    cart.copies = cart.copies.filter((x) => x.id !== order.id);
    localStorage.setItem('cart', JSONfn.stringify(cart));
    this.itemCart$.next(cart);
  }

  removeProduct(product: OrderProduct) {
    const cart: Cart = this.getCart();
    cart.products = cart.products.filter(
      (x) => x.product.id !== product.product.id
    );
    localStorage.setItem('cart', JSONfn.stringify(cart));
    this.itemCart$.next(cart);
  }

  getCopies(): OrderCopy[] {
    return this.getCart().copies;
  }

  getCart(): Cart {
    return (
      JSONfn.parse(localStorage.getItem('cart')) || {
        copies: [],
        products: [],
      }
    );
  }

  clearCart() {
    const empty: Cart = {
      copies: [],
      products: [],
    };
    localStorage.setItem('cart', JSONfn.stringify(empty));
    this.itemCart$.next(empty);
  }

  public getCart$(): Observable<Cart> {
    return this.itemCart$.asObservable();
  }
}
