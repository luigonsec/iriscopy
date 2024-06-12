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
    return this.getCart().copies || [];
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

  validate() {
    const cart = this.getCart();
    const copies = cart.copies;
    if (!Array.isArray(copies)) {
      return false;
    }

    const results = copies.map((copy) => {
      if (!copy.paperSize || !['A3', 'A4'].includes(copy.paperSize.code)) {
        return false;
      }
      if (
        !copy.paperType ||
        !['normal', 'cartulina', 'fotografico'].includes(copy.paperType.code)
      ) {
        return false;
      }
      if (
        !copy.printType ||
        !['blanco-negro', 'color', 'color-pro'].includes(copy.printType.code)
      ) {
        return false;
      }

      if (
        !copy.printForm ||
        !['una-cara', 'doble-cara'].includes(copy.printForm.code)
      ) {
        return false;
      }

      if (
        !copy.orientation ||
        ![
          'vertical-derecha-izquierda',
          'vertical-abajo-arriba',
          'horizontal-abajo-arriba',
          'horizontal-derecha-izquierda',
        ].includes(copy.orientation.code)
      ) {
        return false;
      }

      if (
        !copy.pagesPerSide ||
        !['1_vertical', '2_vertical', '2_horizontal', '4_horizontal'].includes(
          copy.pagesPerSide.code
        )
      ) {
        return false;
      }
    });

    return !results.includes(false);
  }
}
