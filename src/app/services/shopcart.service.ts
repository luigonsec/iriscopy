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
import TarjetaVisita from '../interfaces/TarjetaVisita';
import Flyer from '../interfaces/Flyer';
import Carpeta from '../interfaces/Carpeta';
import Rollup from '../interfaces/Rollup';
import Triptico from '../interfaces/Triptico';
import Diptico from '../interfaces/Diptico';

/**
 * Enum para identificar los diferentes tipos de elementos del carrito
 */
export enum CartItemType {
  COPY = 'copies',
  PRODUCT = 'products',
  BUSINESS_CARD = 'bussinessCard',
  FLYER = 'flyers',
  FOLDER = 'folders',
  DIPTYCH = 'diptychs',
  TRIPTYCH = 'triptychs',
  ROLLUP = 'rollups',
}

/**
 * Interface para la configuración de mensajes
 */
interface CartMessageConfig {
  detail: string;
  summary?: string;
  severity?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ShopcartService {
  private itemCart$: Subject<Cart>;

  constructor(
    private messageService: MessageService,
    private analytics: AnalyticsService,
    private orderService: OrdersService,
    private orders: OrdersService
  ) {
    this.itemCart$ = new Subject();
  }

  /**
   * Método genérico para añadir cualquier tipo de elemento al carrito
   * @param item Elemento a añadir al carrito
   * @param itemType Tipo del elemento (propiedad en el carrito)
   * @param messageConfig Configuración para el mensaje de éxito
   * @param analyticsCallback Callback opcional para enviar datos a analytics
   */
  private async addToCart<T>(
    item: T,
    itemType: CartItemType,
    messageConfig: CartMessageConfig,
    analyticsCallback?: () => Promise<void> | void
  ): Promise<void> {
    const cart: Cart = this.getCart();

    // Añadir el elemento al array correspondiente en el carrito
    if (!cart[itemType]) {
      cart[itemType] = [];
    }
    (cart[itemType] as T[]).push(item);

    // Actualizar el Subject y guardar en localStorage
    this.itemCart$.next(cart);

    localStorage.setItem('cart', JSONfn.stringify(cart));

    // Mostrar mensaje de éxito
    this.messageService.add({
      severity: messageConfig.severity || 'success',
      summary: messageConfig.summary || 'Carro actualizado',
      detail: messageConfig.detail,
    });

    // Ejecutar el callback de analytics si existe
    if (analyticsCallback) {
      await Promise.resolve(analyticsCallback());
    }
  }

  /**
   * Método para eliminar elementos del carrito
   * @param itemType Tipo de elemento a eliminar
   * @param predicate Función que determina qué elemento debe ser eliminado
   * @param analyticsCallback Callback opcional para enviar datos a analytics
   */
  private async removeFromCart<T>(
    itemType: CartItemType,
    predicate: (item: T) => boolean,
    analyticsCallback?: () => Promise<void> | void
  ): Promise<void> {
    const cart: Cart = this.getCart();
    // Filtrar los elementos que no cumplen con el predicado
    (cart[itemType] as T[]) = (cart[itemType] as T[]).filter(
      (item) => !predicate(item)
    );

    // Actualizar localStorage y el Subject

    localStorage.setItem('cart', JSONfn.stringify(cart));
    this.itemCart$.next(cart);

    // Ejecutar el callback de analytics si existe
    if (analyticsCallback) {
      await Promise.resolve(analyticsCallback());
    }
  }

  // Métodos públicos para cada tipo de producto

  async addCopyToCart(order: OrderCopy) {
    await this.addToCart<OrderCopy>(
      order,
      CartItemType.COPY,
      { detail: 'El pedido se ha añadido al carro' },
      async () => {
        this.analytics.anadirAlCarrito([
          await this.orders.orderCopyToAnalytics(order, this.getCart().copies),
        ]);
      }
    );
  }

  async addBusinessCardToCart(order: TarjetaVisita) {
    await this.addToCart<TarjetaVisita>(order, CartItemType.BUSINESS_CARD, {
      detail: 'La tarjeta de visita se ha añadido al carro',
    });
  }

  async addFlyerToCart(order: Flyer) {
    await this.addToCart<Flyer>(order, CartItemType.FLYER, {
      detail: 'El flyer se ha añadido al carro',
    });
  }

  async addFolderToCart(order: Carpeta) {
    await this.addToCart<Carpeta>(order, CartItemType.FOLDER, {
      detail: 'La carpeta se ha añadido al carro',
    });
  }

  async addDipticoToCart(order: Diptico) {
    await this.addToCart<Diptico>(order, CartItemType.DIPTYCH, {
      detail: 'El diptico se ha añadido al carro',
    });
  }

  async addTripticoToCart(order: Triptico) {
    await this.addToCart<Triptico>(order, CartItemType.TRIPTYCH, {
      detail: 'El triptico se ha añadido al carro',
    });
  }

  async addRollupToCart(order: Rollup) {
    await this.addToCart<Rollup>(order, CartItemType.ROLLUP, {
      detail: 'El rollup se ha añadido al carro',
    });
  }

  async addProductToCart(order: OrderProduct) {
    await this.addToCart<OrderProduct>(
      order,
      CartItemType.PRODUCT,
      { detail: 'El producto se ha añadido al carro' },
      () => {
        this.analytics.anadirAlCarrito([
          this.orders.orderProductToAnalytics(order),
        ]);
      }
    );
  }

  updateCopies(orders: OrderCopy[]) {
    const cart = this.getCart();
    cart.copies = orders;
    localStorage.setItem('cart', JSONfn.stringify(cart));
    this.itemCart$.next(cart);
  }

  async removeCopy(order: OrderCopy) {
    await this.removeFromCart<OrderCopy>(
      CartItemType.COPY,
      (item) => item.id === order.id,
      async () => {
        this.analytics.quitarDelCarrito([
          await this.orders.orderCopyToAnalytics(order, this.getCart().copies),
        ]);
      }
    );
  }

  async removeProduct(product: OrderProduct) {
    await this.removeFromCart<OrderProduct>(
      CartItemType.PRODUCT,
      (item) => item.product.id === product.product.id,
      () => {
        this.analytics.quitarDelCarrito([
          this.orders.orderProductToAnalytics(product),
        ]);
      }
    );
  }

  // Métodos para remover otros tipos de productos
  async removeBusinessCard(card: TarjetaVisita) {
    await this.removeFromCart<TarjetaVisita>(
      CartItemType.BUSINESS_CARD,
      (item) => item.id === card.id
    );
  }

  async removeFlyer(flyer: Flyer) {
    await this.removeFromCart<Flyer>(
      CartItemType.FLYER,
      (item) => item.id === flyer.id
    );
  }

  async removeFolder(folder: Carpeta) {
    await this.removeFromCart<Carpeta>(
      CartItemType.FOLDER,
      (item) => item.id === folder.id
    );
  }

  async removeDiptico(diptico: Diptico) {
    await this.removeFromCart<Diptico>(
      CartItemType.DIPTYCH,
      (item) => item.id === diptico.id
    );
  }

  async removeTriptico(triptico: Triptico) {
    await this.removeFromCart<Triptico>(
      CartItemType.TRIPTYCH,
      (item) => item.id === triptico.id
    );
  }

  async removeRollup(rollup: Rollup) {
    await this.removeFromCart<Rollup>(
      CartItemType.ROLLUP,
      (item) => item.id === rollup.id
    );
  }

  getCopies(): OrderCopy[] {
    return this.getCart().copies || [];
  }

  getCart(): Cart {
    return (
      JSONfn.parse(localStorage.getItem('cart')) || {
        copies: [],
        products: [],
        bussinessCard: [],
        flyers: [],
        folders: [],
        diptychs: [],
        triptychs: [],
        rollups: [],
      }
    );
  }

  async getAnalyticsCart() {
    const cart = this.getCart();
    return await Promise.all([
      ...cart.copies.map((copy) =>
        this.orderService.orderCopyToAnalytics(copy, cart.copies)
      ),
      ...cart.products.map((product) =>
        this.orderService.orderProductToAnalytics(product)
      ),
    ]);
  }

  clearCart() {
    const empty: Cart = {
      copies: [],
      products: [],
      bussinessCard: [],
      flyers: [],
      folders: [],
      diptychs: [],
      triptychs: [],
      rollups: [],
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
