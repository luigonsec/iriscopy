import { Injectable } from '@angular/core';
import { ShippingCostsService } from './shipping-costs.service';
import moment from 'moment';
import Coupon from '../interfaces/Coupon';
import generalConfig from 'src/config/general';

@Injectable({
  providedIn: 'root',
})
export class ShippingHandlerService {
  constructor(private shippingCostService: ShippingCostsService) {}

  /**
   * Calcula el costo de envío estándar basado en el subtotal y código postal
   * @param billing Componente de facturación que contiene el código postal
   * @param shipping Componente de envío opcional (si la dirección es diferente)
   * @param differentAddress Indica si la dirección de envío es diferente de la facturación
   * @param subtotal Subtotal del pedido
   * @param discount Descuento aplicado
   * @returns Información sobre disponibilidad y costos de envío
   */
  public calculateShippingCosts(
    billing: any,
    shipping: any,
    differentAddress: boolean,
    subtotal: number
  ): {
    standardCost: number;
    urgentCost: number;
    standardAvailable: boolean;
    urgentAvailable: boolean;
  } {
    if (!billing) {
      const standardCost = generalConfig.SHIPPING_COST;
      return {
        standardCost: standardCost,
        urgentCost: standardCost + generalConfig.URGENT_SHIPPING_PREMIUM,
        standardAvailable: true,
        urgentAvailable: true,
      };
    }

    const postcode =
      differentAddress && shipping
        ? shipping.shippingDetails.postcode
        : billing.billingDetails.postcode;

    const urgentAvailable =
      this.shippingCostService.isUrgentShippingAvailable(postcode);
    const standardAvailable = urgentAvailable; // Mismas restricciones

    let standardCost = this.shippingCostService.getGastosDeEnvio(
      subtotal,
      postcode
    );

    let urgentCost = standardCost + generalConfig.URGENT_SHIPPING_PREMIUM;

    // if (coupons.length && coupons[0].applicability === 'shipping') {
    //   // Si el cupón aplica al envío, se aplica el descuento al costo estándar
    //   const urgentDiscount =
    //     coupons[0].discount_type === 'percent'
    //       ? (urgentCost * coupons[0].amount) / 100
    //       : coupons[0].amount;
    //   urgentCost = Math.max(0, urgentCost - urgentDiscount);

    //   const standardDiscount =
    //     coupons[0].discount_type === 'percent'
    //       ? (standardCost * coupons[0].amount) / 100
    //       : coupons[0].amount;
    //   standardCost = Math.max(0, standardCost - standardDiscount);
    // }

    return {
      standardCost,
      urgentCost,
      standardAvailable,
      urgentAvailable,
    };
  }

  /**
   * Calcula el costo final de envío basado en el método de entrega
   * @param deliveryMethod Método de entrega seleccionado ('Pickup', 'Shipping', 'UrgentShipping')
   * @param shippingCostStandard Costo de envío estándar calculado
   * @param shippingCostUrgent Costo de envío urgente
   * @returns Costo final de envío
   */
  public calculateFinalShippingCost(
    deliveryMethod: string,
    shippingCostStandard: number,
    shippingCostUrgent: number
  ): number {
    if (deliveryMethod === 'Pickup') {
      return 0;
    } else if (deliveryMethod === 'Shipping') {
      return shippingCostStandard;
    } else if (deliveryMethod === 'UrgentShipping') {
      return shippingCostUrgent;
    }
    return 0;
  }

  /**
   * Agrega días laborables a una fecha
   * @param date Fecha inicial
   * @param workingDays Número de días laborables a añadir
   * @returns Nueva fecha con los días laborables añadidos
   */
  public addWorkingDays(
    date: moment.Moment,
    workingDays: number
  ): moment.Moment {
    const result = date.clone();
    while (workingDays > 0) {
      result.add(1, 'day');
      // Con isoWeekday(), de lunes (1) a viernes (5) son días laborables.
      if (result.isoWeekday() <= 5) {
        workingDays--;
      }
    }
    return result;
  }

  /**
   * Calcula la fecha estimada de entrega basada en el día de la semana
   * @returns Texto formateado con el rango de fechas de entrega previsto
   */
  public calculateExpectedDeliveryDate(): string {
    // Asegurarse de que Moment use el locale en español
    moment.locale('es');

    const today = moment();
    const dayOfWeek = today.isoWeekday(); // 1 (Lunes) al 7 (Domingo)
    const currentHour = today.hour();
    let earliestDelivery: moment.Moment;
    let latestDelivery: moment.Moment;

    // Cálculo basado en el día de la semana
    if (dayOfWeek < 5 && dayOfWeek > 0) {
      earliestDelivery = this.addWorkingDays(today, 2); // Miércoles
      latestDelivery = this.addWorkingDays(today, 3); // Jueves
    } else if (dayOfWeek === 5) {
      // Viernes
      if (currentHour < 10) {
        earliestDelivery = this.addWorkingDays(today, 1); // Lunes siguiente
        latestDelivery = this.addWorkingDays(today, 3); // Miércoles siguiente
      } else {
        earliestDelivery = this.addWorkingDays(today, 2); // Martes siguiente
        latestDelivery = this.addWorkingDays(today, 3); // Miércoles siguiente
      }
    } else {
      // Sábado o Domingo
      // Consideramos como si fuera un pedido de lunes
      // Ajustamos today para que sea el lunes siguiente
      const nextMonday = today.clone().add(1, 'week').isoWeekday(1);
      earliestDelivery = this.addWorkingDays(nextMonday, 2); // Miércoles
      latestDelivery = this.addWorkingDays(nextMonday, 3); // Jueves
    }

    // Formateamos la salida para mostrar abreviaturas en minúsculas
    return `${earliestDelivery.format('ddd D').toLowerCase()} - ${latestDelivery
      .format('ddd D')
      .toLowerCase()}`;
  }
}
