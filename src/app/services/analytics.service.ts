import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private dataLayer = (window as any).dataLayer || [];

  constructor() {}

  /**
   * Listado de productos: Impresiones
   * Equivale a 'view_item_list'
   */
  public verListadoProductos(items: any[]): void {
    this.dataLayer.push({ ecommerce: null });
    this.dataLayer.push({
      event: 'view_item_list',
      ecommerce: {
        items,
      },
    });
  }

  /**
   * Listado de productos: Clicks
   * Equivale a 'select_item'
   */
  public clickEnProducto(items: any[]): void {
    this.dataLayer.push({ ecommerce: null });
    this.dataLayer.push({
      event: 'select_item',
      ecommerce: {
        items,
      },
    });
  }

  /**
   * Detalle del producto
   * Equivale a 'view_item'
   */
  public verDetalleProducto(items: any[]): void {
    this.dataLayer.push({ ecommerce: null });
    this.dataLayer.push({
      event: 'view_item',
      ecommerce: {
        items,
      },
    });
  }

  /**
   * Añadir al carrito
   * Equivale a 'add_to_cart'
   */
  public anadirAlCarrito(items: any[], cartUpdate?: number): void {
    this.dataLayer.push({ ecommerce: null });
    this.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        // Puedes incluir cartUpdate si lo necesitas, p.ej. cart_update: cartUpdate,
        items,
      },
    });
  }

  /**
   * Quitar del carrito
   * Equivale a 'remove_from_cart'
   */
  public quitarDelCarrito(items: any[], cartUpdate?: number): void {
    this.dataLayer.push({ ecommerce: null });
    this.dataLayer.push({
      event: 'remove_from_cart',
      ecommerce: {
        // cart_update: cartUpdate,
        items,
      },
    });
  }

  /**
   * Proceso de pago: Info entrega
   * Equivale a 'add_shipping_info'
   */
  public infoEntrega(items: any[], shippingTier: string): void {
    this.dataLayer.push({ ecommerce: null });
    this.dataLayer.push({
      event: 'add_shipping_info',
      ecommerce: {
        shipping_tier: shippingTier,
        items,
      },
    });
  }

  /**
   * Proceso de pago: Info pago
   * Equivale a 'add_payment_info'
   */
  public infoPago(items: any[], paymentType: string): void {
    console.log('pushing');

    this.dataLayer.push({ ecommerce: null });
    this.dataLayer.push({
      event: 'add_payment_info',
      ecommerce: {
        payment_type: paymentType,
        items,
      },
    });
  }

  /**
   * Compra
   * Equivale a 'purchase'
   * Recibe los datos básicos de la transacción y el array de productos
   */
  public registrarCompra(
    transactionId: string,
    affiliation: string,
    value: number,
    tax: number,
    shipping: number,
    currency: string,
    coupon: string,
    items: any[]
  ): void {
    this.dataLayer.push({ ecommerce: null });
    this.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: transactionId,
        affiliation,
        value,
        tax,
        shipping,
        currency,
        coupon,
        items,
      },
    });
  }

  /**
   * Ver carrito
   * Equivale a 'view_cart'
   */
  public verCarrito(items: any[]): void {
    this.dataLayer.push({ ecommerce: null });
    this.dataLayer.push({
      event: 'view_cart',
      ecommerce: {
        items,
      },
    });
  }
}
