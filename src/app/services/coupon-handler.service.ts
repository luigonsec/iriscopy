import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { applyCoupon, clearCoupon } from 'src/app/_actions/coupons.actions';
import { selectCoupon } from 'src/app/_selectors/coupons.selector';
import Coupon from '../interfaces/Coupon';
import { CouponsService } from './coupons.service';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class CouponHandlerService {
  private first_time_coupon_applied = false;
  private searching_coupon = false;
  private apply_cupon_text = 'Aplicar mi cupón';

  constructor(
    private store: Store,
    private couponsService: CouponsService,
    private messageService: MessageService
  ) {}

  /**
   * Elimina el cupón actual
   */
  public removeCoupon(coupon): void {
    if (!coupon) return;
    this.store.dispatch(clearCoupon());
  }

  /**
   * Valida y aplica un código de cupón
   * @param inputCoupon Código de cupón a validar
   * @returns Observable que emite cuando se completa la validación
   */
  public getCoupon(inputCoupon: string): Observable<any> {
    this.first_time_coupon_applied = true;
    this.searching_coupon = true;
    this.apply_cupon_text = 'Buscando cupón...';

    return new Observable((observer) => {
      this.couponsService
        .validate(inputCoupon)
        .subscribe({
          next: (coupon: Coupon) => {
            coupon.valid_until = moment().valueOf() + 15 * 60 * 1000;
            this.store.dispatch(applyCoupon({ coupon: coupon }));
            observer.next(coupon);
            observer.complete();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              detail: 'El código promocional no existe',
              summary: 'Código erróneo',
            });
            observer.error(err);
          },
        })
        .add(() => {
          this.searching_coupon = false;
          this.apply_cupon_text = 'Aplicar mi cupón';
        });
    });
  }

  /**
   * Verifica si el cupón cumple con la cantidad mínima requerida
   * @param coupon Cupón a verificar
   * @param precio_copias Precio actual de las copias
   * @returns true si el cupón es aplicable
   */
  private comprobarCantidadMinima(
    coupon: Coupon,
    precio_copias: number
  ): boolean {
    if (coupon.minimum_amount > precio_copias) {
      return false;
    }
    return true;
  }

  /**
   * Valida un cupón y lo aplica si es válido
   * @param coupon Cupón a validar
   * @param precio_copias Precio actual de las copias
   * @param calcularPreciosCallback Función para recalcular los precios
   * @returns boolean indicando si el cupón fue aplicado
   */
  public validateCoupon(
    coupon: Coupon,
    precio_copias: number,
    calcularPreciosCallback: () => void
  ): boolean {
    if (!coupon) return false;

    if (!this.comprobarCantidadMinima(coupon, precio_copias)) {
      this.messageService.add({
        severity: 'error',
        detail: `El código promocional solo puede aplicarse a pedidos de copias mayores de ${coupon.minimum_amount} €`,
        summary: 'Código no aplicado',
      });
      this.removeCoupon(coupon);
      return false;
    } else if (coupon.valid_until < moment().valueOf()) {
      this.removeCoupon(coupon);
      return false;
    }

    this.store.dispatch(applyCoupon({ coupon: coupon }));
    calcularPreciosCallback();

    if (this.first_time_coupon_applied) {
      this.messageService.add({
        severity: 'success',
        detail: 'El código promocional se ha aplicado',
        summary: 'Código aplicado',
      });
    }
    return true;
  }

  /**
   * Calcula el descuento aplicado por el cupón
   * @param subtotal Subtotal del pedido
   * @param coupon Cupón aplicado
   * @returns El valor del descuento
   */
  public getDiscount(subtotal: number, coupon: Coupon): number {
    if (!coupon) return 0;

    let discountAmount = 0;
    if (coupon.discount_type === 'percent') {
      discountAmount = subtotal * (coupon.amount / 100);
    } else if (coupon.discount_type === 'fixed_cart') {
      discountAmount = coupon.amount;
    }
    return discountAmount;
  }

  /**
   * Suscribe a los cambios en el estado del cupón
   * @param callback Función a ejecutar cuando cambie el estado del cupón
   * @returns Suscripción al estado del cupón
   */
  public subscribeCoupons(callback: (coupon: Coupon[]) => void): Subscription {
    return this.store.select(selectCoupon).subscribe(callback);
  }

  /**
   * Obtiene el texto para el botón de aplicar cupón
   */
  public getApplyCouponText(): string {
    return this.apply_cupon_text;
  }

  /**
   * Verifica si se está buscando un cupón actualmente
   */
  public isSearchingCoupon(): boolean {
    return this.searching_coupon;
  }
}
