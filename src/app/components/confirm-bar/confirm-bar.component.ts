import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { v4 as uuidv4 } from 'uuid';
import Nota from '../../interfaces/Nota';
import Orderable from '../../interfaces/Orderable';

/**
 * Interface para el precio calculado y las notas asociadas
 */
interface PrecioCalculado {
  precio: number;
  notas: Nota[];
}

/**
 * Componente para la barra de confirmación que muestra el precio y permite
 * añadir configuraciones al carrito o finalizar la compra
 */
@Component({
  selector: 'app-confirm-bar',
  templateUrl: './confirm-bar.component.html',
  styleUrls: ['./confirm-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmBarComponent implements OnInit, OnChanges {
  /** Función para calcular el precio y obtener las notas */
  @Input() getPrecio: () => Promise<PrecioCalculado> | PrecioCalculado =
    () => ({ precio: 0, notas: [] });

  /** Pedido actual que se está configurando */
  @Input() order: Orderable;

  /** Función para resetear el formulario después de añadir al carrito */
  @Input() reset: () => void = () => undefined;

  @Input() addToCartFn: (order: Orderable) => Promise<void> = () =>
    Promise.resolve();

  /** Precio calculado para el pedido */
  public precio: number = 0;

  /** Notas asociadas al pedido */
  public notas: Nota[] = [];

  /** Indica si los botones deben estar deshabilitados */
  public disableButtons: boolean = false;

  /** Indica si está cargando datos */
  public isLoading: boolean = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  /**
   * Función para optimizar el renderizado de listas en el template
   * @param index Índice del elemento en la lista
   * @param nota Nota actual
   * @returns Un valor único para identificar cada nota
   */
  public trackByNota(index: number, nota: Nota): string {
    return nota.text;
  }

  /**
   * Verifica si los botones deben estar habilitados o no
   * basado en si se requieren comentarios para alguna nota
   */
  private checkButtonsEnabled(): void {
    const requiereComentarios = this.notas?.some(
      (nota) =>
        nota.require_comments &&
        (!this.order?.additionalComments ||
          this.order.additionalComments.trim() === '')
    );

    this.disableButtons = requiereComentarios || this.isLoading;
    this.cdr.markForCheck();
  }

  /**
   * Calcula el precio del pedido y actualiza las notas
   * @returns Una promesa que resuelve cuando se ha calculado el precio
   */
  public async calculatePrice(): Promise<void> {
    try {
      this.isLoading = true;
      this.cdr.markForCheck();

      const result = await Promise.resolve(this.getPrecio());

      this.precio = result.precio;
      this.notas = result.notas || [];

      this.isLoading = false;
      this.checkButtonsEnabled();
    } catch (error) {
      this.isLoading = false;
      this.disableButtons = true;
      this.cdr.markForCheck();
    }
  }

  /**
   * Maneja los cambios en los inputs del componente
   * @param changes Cambios detectados por Angular
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Solo recalcula el precio si cambia el pedido o la función getPrecio
    if (changes.order || changes.getPrecio) {
      this.calculatePrice();
    } else {
      // Si no cambian los inputs principales, solo verifica los botones
      this.checkButtonsEnabled();
    }
  }

  /**
   * Añade la configuración actual al carrito
   * @param navigateToPayment Indica si debe navegar a la página de pago después de añadir
   */
  public async addToCart(navigateToPayment: boolean = false): Promise<void> {
    if (this.disableButtons) return;

    try {
      this.isLoading = true;
      this.disableButtons = true;
      this.cdr.markForCheck();

      // Crea una copia profunda del pedido y asigna un ID único
      const orderCopy = structuredClone(this.order);
      orderCopy.id = uuidv4();

      // Añade al carrito
      await this.addToCartFn(orderCopy);

      // Resetea el formulario
      if (typeof this.reset === 'function') {
        this.reset();
      }

      window.scrollTo(0, 0);

      // Navega al pago si es necesario
      if (navigateToPayment) {
        this.router.navigate(['payment']);
      }
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    } finally {
      this.isLoading = false;
      this.disableButtons = false;
      this.cdr.markForCheck();
    }
  }

  /**
   * Añade la configuración al carrito
   */
  public addConfiguration(): void {
    this.addToCart(false);
  }

  /**
   * Añade la configuración al carrito y navega a la página de pago
   */
  public finishAndPay(): void {
    this.addToCart(true);
  }

  /**
   * Inicializa el componente
   */
  ngOnInit(): void {
    this.calculatePrice();
  }
}
