import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OrderCopy } from '../interfaces/OrderCopy';
import Cart from '../interfaces/Cart';
import OrderProduct from '../interfaces/OrderProduct';
import JSONfn from 'json-fn';
import options from 'src/config/options';
import { MessageService } from 'primeng/api';
import { AnalyticsService } from './analytics.service';
import { OrdersService } from './orders.service';
@Injectable({
  providedIn: 'root',
})
export class ShopcartService {
  private itemCart$: Subject<Cart>;

  constructor(
    private messageService: MessageService,
    private analytics: AnalyticsService,
    private orders: OrdersService
  ) {
    this.itemCart$ = new Subject();
  }

  async addCopyToCart(order: OrderCopy) {
    const cart: Cart = this.getCart();
    cart.copies.push(order);
    this.itemCart$.next(cart);
    localStorage.setItem('cart', JSONfn.stringify(cart));
    this.messageService.add({
      severity: 'success',
      summary: 'Carro actualizado',
      detail: 'El pedido se ha añadido al carro',
    });

    this.analytics.anadirAlCarrito([
      await this.orders.orderCopyToAnalytics(order, this.getCart().copies),
    ]);
  }

  addProductToCart(order: OrderProduct) {
    const cart: Cart = this.getCart();
    cart.products.push(order);
    this.itemCart$.next(cart);
    localStorage.setItem('cart', JSONfn.stringify(cart));

    this.analytics.anadirAlCarrito([
      this.orders.orderProductToAnalytics(order),
    ]);
    this.messageService.add({
      severity: 'success',
      summary: 'Carro actualizado',
      detail: 'El producto se ha añadido al carro',
    });
  }

  updateCopies(orders: OrderCopy[]) {
    const cart = this.getCart();
    cart.copies = orders;
    localStorage.setItem('cart', JSONfn.stringify(cart));
    this.itemCart$.next(cart);
  }

  async removeCopy(order: OrderCopy) {
    const cart: Cart = this.getCart();
    cart.copies = cart.copies.filter((x) => x.id !== order.id);
    localStorage.setItem('cart', JSONfn.stringify(cart));
    this.itemCart$.next(cart);
    this.analytics.quitarDelCarrito([
      await this.orders.orderCopyToAnalytics(order, this.getCart().copies),
    ]);
  }

  removeProduct(product: OrderProduct) {
    const cart: Cart = this.getCart();
    cart.products = cart.products.filter(
      (x) => x.product.id !== product.product.id
    );
    localStorage.setItem('cart', JSONfn.stringify(cart));
    this.itemCart$.next(cart);
    this.analytics.quitarDelCarrito([
      this.orders.orderProductToAnalytics(product),
    ]);
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
    const validCodes = {};
    Object.keys(options).forEach((key) => {
      validCodes[key] = options[key].map((x) => x.code);
    });

    for (const copy of copies) {
      if (
        !copy.paperSize ||
        !validCodes['paperSize'].includes(copy.paperSize.code) ||
        !copy.paperType ||
        !validCodes['paperType'].includes(copy.paperType.code) ||
        !copy.printType ||
        !validCodes['printType'].includes(copy.printType.code) ||
        !copy.printForm ||
        !validCodes['printForm'].includes(copy.printForm.code) ||
        !copy.orientation ||
        !validCodes['orientation'].includes(copy.orientation.code) ||
        !copy.pagesPerSide ||
        !validCodes['pagesPerSide'].includes(copy.pagesPerSide.code) ||
        !copy.finishType ||
        !validCodes['finishType'].includes(copy.finishType.code)
      ) {
        return false;
      }
    }

    return true;
  }
}
