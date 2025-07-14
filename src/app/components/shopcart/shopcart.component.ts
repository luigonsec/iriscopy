import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import OrderProduct from 'src/app/interfaces/OrderProduct';
import { OrdersService } from 'src/app/services/orders.service';
import {
  ShopcartService,
  CartItemType,
} from 'src/app/services/shopcart.service';
import { PricesService } from '../../services/prices.service';
import Flyer from '../../interfaces/Flyer';
import TarjetaVisita from '../../interfaces/TarjetaVisita';
import Cart from '../../interfaces/Cart';
import Carpeta from '../../interfaces/Carpeta';
import Diptico from '../../interfaces/Diptico';
import Triptico from '../../interfaces/Triptico';
import Cartel from '../../interfaces/Cartel';
import Rollup from '../../interfaces/Rollup';
import Revista from '../../interfaces/Revista';
import { PriceResult } from '../../interfaces/PriceResult';

@Component({
    selector: 'app-shopcart',
    templateUrl: './shopcart.component.html',
    styleUrls: ['./shopcart.component.scss'],
    standalone: false
})
export class ShopcartComponent implements OnInit, OnDestroy {
  // Para mantener compatibilidad con el resto del código
  public copies: OrderCopy[] = [];
  public products: OrderProduct[] = [];
  public flyers: Flyer[] = [];
  public businessCards: TarjetaVisita[] = [];
  public folders: Carpeta[] = [];
  public diptychs: Diptico[] = [];
  public triptychs: Triptico[] = [];
  public rollups: Rollup[] = [];
  public posters: Cartel[] = [];
  public magazines: Revista[] = [];

  // Un solo objeto para todos los precios y notas
  public itemsPrice: { [id: string]: number } = {};
  public itemsNotes: { [id: string]: string[] } = {};

  // Objeto público de funciones de eliminación para usar en la plantilla
  public removeItemFunctions = {
    businessCards: (item: TarjetaVisita) => this.removeBusinessCard(item),
    flyers: (item: Flyer) => this.removeFlyer(item),
    folders: (item: Carpeta) => this.removeFolder(item),
    diptychs: (item: Diptico) => this.removeDiptych(item),
    triptychs: (item: Triptico) => this.removeTriptych(item),
    rollups: (item: Rollup) => this.removeRollup(item),
    // Agregamos otros tipos según se necesite
  };

  // Mapeando CartItemType a propiedades de clase
  private itemTypePropertyMap = {
    [CartItemType.COPY]: 'copies',
    [CartItemType.PRODUCT]: 'products',
    [CartItemType.BUSINESS_CARD]: 'businessCards',
    [CartItemType.FLYER]: 'flyers',
    [CartItemType.FOLDER]: 'folders',
    [CartItemType.DIPTYCH]: 'diptychs',
    [CartItemType.TRIPTYCH]: 'triptychs',
    [CartItemType.ROLLUP]: 'rollups',
    [CartItemType.POSTER]: 'posters',
    [CartItemType.MAGAZINE]: 'magazines',
  };

  // Los mapas de propiedad para precios y notas se eliminaron ya que ahora
  // utilizamos los objetos unificados itemsPrice e itemsNotes

  // Mapeando CartItemType a método del servicio de carrito para eliminar
  private removeServiceMethodMap = {
    [CartItemType.COPY]: (item: any) => this.shopcartService.removeCopy(item),
    [CartItemType.PRODUCT]: (item: any) =>
      this.shopcartService.removeProduct(item),
    [CartItemType.BUSINESS_CARD]: (item: any) =>
      this.shopcartService.removeBusinessCard(item),
    [CartItemType.FLYER]: (item: any) => this.shopcartService.removeFlyer(item),
    [CartItemType.FOLDER]: (item: any) =>
      this.shopcartService.removeFolder(item),
    [CartItemType.DIPTYCH]: (item: any) =>
      this.shopcartService.removeDiptico(item),
    [CartItemType.TRIPTYCH]: (item: any) =>
      this.shopcartService.removeTriptico(item),
    [CartItemType.ROLLUP]: (item: any) =>
      this.shopcartService.removeRollup(item),
    [CartItemType.POSTER]: (item: any) =>
      this.shopcartService.removePoster(item),
    [CartItemType.MAGAZINE]: (item: any) =>
      this.shopcartService.removeMagazine(item),
  };

  cartSubscription: Subscription;
  constructor(
    private router: Router,
    private orderService: OrdersService,
    private shopcartService: ShopcartService,
    private pricesService: PricesService
  ) {}

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  /**
   * Método genérico para calcular el total de todos los artículos del carrito
   */
  getTotalPrice() {
    let totalPrice = 0;

    // Para cada tipo de elemento calculamos su precio
    Object.values(CartItemType).forEach((itemType) => {
      const propertyName = this.itemTypePropertyMap[itemType];
      if (!propertyName) return;

      const items = this[propertyName];
      if (!items || !items.length) return;

      // Para productos usamos un cálculo especial
      if (itemType === CartItemType.PRODUCT) {
        totalPrice += items
          .map((x) => this.getProductPrice(x))
          .reduce((a, b) => a + b, 0);
      } else {
        totalPrice += items
          .map((x) => this.itemsPrice[x.id] || 0)
          .reduce((a, b) => a + b, 0);
      }
    });

    return totalPrice;
  }

  /**
   * Método genérico para obtener precios de todos los artículos del carrito
   */
  getPrintItemPrices() {
    Object.values(CartItemType).forEach((itemType) => {
      const propertyName = this.itemTypePropertyMap[itemType];
      if (!propertyName) return;

      const items = this[propertyName];
      if (!items || !items.length || itemType === CartItemType.PRODUCT) return;

      items.forEach((item) => {
        this.getItemPrice(itemType, item);
      });
    });
  }

  /**
   * Método genérico para obtener el precio de un artículo específico
   * Usa el método genérico de PricesService
   */
  private getItemPrice(itemType: CartItemType, item: any): void {
    try {
      // Caso especial para copies que necesitan el array completo de copies
      if (itemType === CartItemType.COPY) {
        this.pricesService
          .getCopyPrice(item, this.copies)
          .subscribe(this.processPriceResult(itemType, item));
      } else {
        this.pricesService
          .getItemPrice(itemType, item)
          .subscribe(this.processPriceResult(itemType, item));
      }
    } catch (error) {
      console.error(
        `Error al obtener el precio para el tipo ${itemType}:`,
        error
      );
    }
  }

  /**
   * Procesa el resultado de una llamada de precio
   */
  private processPriceResult(itemType: CartItemType, item: any) {
    return ({ precio, notas }: PriceResult) => {
      // Actualizar el mapa unificado
      this.itemsPrice[item.id] = precio;
      this.itemsNotes[item.id] = notas;
    };
  }

  /**
   * Método genérico para eliminar un artículo del carrito
   */
  removeItem(itemType: CartItemType, item: any): void {
    const removeMethod = this.removeServiceMethodMap[itemType];
    if (!removeMethod) {
      console.warn(`No se encontró método para eliminar el tipo: ${itemType}`);
      return;
    }

    removeMethod(item);
  }

  /**
   * Método utilitario para obtener los elementos de un tipo específico
   */
  getItemsByType<T>(itemType: CartItemType): T[] {
    const propertyName = this.itemTypePropertyMap[itemType];
    return propertyName ? (this[propertyName] as T[]) : [];
  }

  // Los siguientes métodos se mantienen para compatibilidad
  getProductPrice(order: OrderProduct): number {
    return parseFloat(order.product.price) * order.quantity;
  }

  getCopyPrice(order: OrderCopy) {
    this.getItemPrice(CartItemType.COPY, order);
  }

  getBusinessCardPrice(businessCard: TarjetaVisita) {
    this.getItemPrice(CartItemType.BUSINESS_CARD, businessCard);
  }

  getFlyerPrice(flyer: Flyer) {
    this.getItemPrice(CartItemType.FLYER, flyer);
  }

  getFolderPrice(folder: Carpeta) {
    this.getItemPrice(CartItemType.FOLDER, folder);
  }

  getDiptychPrice(diptych: Diptico) {
    this.getItemPrice(CartItemType.DIPTYCH, diptych);
  }

  getTriptychPrice(triptych: Triptico) {
    this.getItemPrice(CartItemType.TRIPTYCH, triptych);
  }

  getRollupPrice(rollup: Rollup) {
    this.getItemPrice(CartItemType.ROLLUP, rollup);
  }

  removeCopy(order: OrderCopy): void {
    this.removeItem(CartItemType.COPY, order);
  }

  removeFlyer(order: Flyer): void {
    this.removeItem(CartItemType.FLYER, order);
  }

  removeBusinessCard(card: TarjetaVisita): void {
    this.removeItem(CartItemType.BUSINESS_CARD, card);
  }

  removeFolder(folder: Carpeta): void {
    this.removeItem(CartItemType.FOLDER, folder);
  }

  removeDiptych(diptych: Diptico): void {
    this.removeItem(CartItemType.DIPTYCH, diptych);
  }

  removeTriptych(triptych: Triptico): void {
    this.removeItem(CartItemType.TRIPTYCH, triptych);
  }

  removeRollup(rollup: Rollup): void {
    this.removeItem(CartItemType.ROLLUP, rollup);
  }

  removeProduct(product: OrderProduct): void {
    this.removeItem(CartItemType.PRODUCT, product);
  }

  editCopy(order: OrderCopy): void {
    this.orderService.setOrderToEdit(order);
    this.router.navigate(['/print']);
  }

  removeFile(order_id: string, files_id: number) {
    const orderIndex = this.copies.findIndex((order) => order.id === order_id);

    if (orderIndex !== -1) {
      const order = this.copies[orderIndex];
      const files = order.files;
      this.copies[orderIndex].files = files.filter(
        (file) => file.id !== files_id
      );

      if (this.copies[orderIndex].files.length === 0) {
        this.copies.splice(orderIndex, 1);
      }

      this.shopcartService.updateCopies(this.copies);
    }
  }

  /**
   * Método para actualizar los arrays de elementos del carrito
   */
  private updateCartItems(cart: Cart) {
    this.copies = cart.copies || [];
    this.products = cart.products || [];
    this.businessCards = cart.bussinessCard || [];
    this.flyers = cart.flyers || [];
    this.folders = cart.folders || [];
    this.diptychs = cart.diptychs || [];
    this.triptychs = cart.triptychs || [];
    this.rollups = cart.rollups || [];
    // Si añades más tipos en el futuro, agrégalos aquí
  }

  ngOnInit(): void {
    const cart = this.shopcartService.getCart();
    this.updateCartItems(cart);
    this.getPrintItemPrices();

    this.cartSubscription = this.shopcartService
      .getCart$()
      .subscribe((cart) => {
        this.updateCartItems(cart);
        this.getPrintItemPrices();
      });
  }
}
