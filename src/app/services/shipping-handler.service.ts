import { Injectable } from '@angular/core';
import { ShippingCostsService } from './shipping-costs.service';
import moment from 'moment';
import Coupon from '../interfaces/Coupon';
import generalConfig from 'src/config/general';
import Flyer from '../interfaces/Flyer';
import TarjetaVisita from '../interfaces/TarjetaVisita';
import Carpeta from '../interfaces/Carpeta';
import Diptico from '../interfaces/Diptico';
import Triptico from '../interfaces/Triptico';
import Rollup from '../interfaces/Rollup';
import Cartel from '../interfaces/Cartel';
import Revista from '../interfaces/Revista';

export interface PrintItems {
  flyers?: Flyer[];
  businessCards?: TarjetaVisita[];
  folders?: Carpeta[];
  diptychs?: Diptico[];
  triptychs?: Triptico[];
  rollups?: Rollup[];
  posters?: Cartel[];
  magazines?: Revista[];
}

export enum ShippingZone {
  PENINSULA = 'peninsula',
  MALLORCA = 'mallorca',
  IBIZA_MENORCA = 'ibiza_menorca',
  CANARIAS = 'canarias',
}

export interface WeightRange {
  maxWeight: number; // in kg
  prices: {
    [ShippingZone.PENINSULA]: number;
    [ShippingZone.MALLORCA]: number;
    [ShippingZone.IBIZA_MENORCA]: number;
    [ShippingZone.CANARIAS]: number;
  };
}

export const WEIGHT_PRICE_RANGES: WeightRange[] = [
  {
    maxWeight: 1,
    prices: {
      [ShippingZone.PENINSULA]: 3.65,
      [ShippingZone.MALLORCA]: 5.66,
      [ShippingZone.IBIZA_MENORCA]: 6.59,
      [ShippingZone.CANARIAS]: 9.74,
    },
  },
  {
    maxWeight: 2,
    prices: {
      [ShippingZone.PENINSULA]: 3.87,
      [ShippingZone.MALLORCA]: 6.11,
      [ShippingZone.IBIZA_MENORCA]: 7.28,
      [ShippingZone.CANARIAS]: 10.71,
    },
  },
  {
    maxWeight: 3,
    prices: {
      [ShippingZone.PENINSULA]: 4.16,
      [ShippingZone.MALLORCA]: 6.35,
      [ShippingZone.IBIZA_MENORCA]: 7.55,
      [ShippingZone.CANARIAS]: 12.17,
    },
  },
  {
    maxWeight: 5,
    prices: {
      [ShippingZone.PENINSULA]: 4.85,
      [ShippingZone.MALLORCA]: 8.12,
      [ShippingZone.IBIZA_MENORCA]: 9.67,
      [ShippingZone.CANARIAS]: 14.28,
    },
  },
  {
    maxWeight: 10,
    prices: {
      [ShippingZone.PENINSULA]: 5.35,
      [ShippingZone.MALLORCA]: 12.61,
      [ShippingZone.IBIZA_MENORCA]: 15.02,
      [ShippingZone.CANARIAS]: 20.02,
    },
  },
  {
    maxWeight: 15,
    prices: {
      [ShippingZone.PENINSULA]: 6.65,
      [ShippingZone.MALLORCA]: 17.1,
      [ShippingZone.IBIZA_MENORCA]: 20.37,
      [ShippingZone.CANARIAS]: 30.41,
    },
  },
  {
    maxWeight: 20,
    prices: {
      [ShippingZone.PENINSULA]: 7.64,
      [ShippingZone.MALLORCA]: 19.39,
      [ShippingZone.IBIZA_MENORCA]: 23.81,
      [ShippingZone.CANARIAS]: 43.64,
    },
  },
  {
    maxWeight: 30,
    prices: {
      [ShippingZone.PENINSULA]: 8.5,
      [ShippingZone.MALLORCA]: 23.96,
      [ShippingZone.IBIZA_MENORCA]: 30.7,
      [ShippingZone.CANARIAS]: 69.0,
    },
  },
  {
    maxWeight: 40,
    prices: {
      [ShippingZone.PENINSULA]: 10.86,
      [ShippingZone.MALLORCA]: 28.54,
      [ShippingZone.IBIZA_MENORCA]: 37.59,
      [ShippingZone.CANARIAS]: 96.56,
    },
  },
  {
    maxWeight: 50,
    prices: {
      [ShippingZone.PENINSULA]: 12.73,
      [ShippingZone.MALLORCA]: 33.12,
      [ShippingZone.IBIZA_MENORCA]: 44.48,
      [ShippingZone.CANARIAS]: 123.02,
    },
  },
  {
    maxWeight: 60,
    prices: {
      [ShippingZone.PENINSULA]: 15.18,
      [ShippingZone.MALLORCA]: 37.7,
      [ShippingZone.IBIZA_MENORCA]: 51.37,
      [ShippingZone.CANARIAS]: 149.48,
    },
  },
  {
    maxWeight: 70,
    prices: {
      [ShippingZone.PENINSULA]: 17.67,
      [ShippingZone.MALLORCA]: 42.28,
      [ShippingZone.IBIZA_MENORCA]: 58.26,
      [ShippingZone.CANARIAS]: 175.94,
    },
  },
  {
    maxWeight: 80,
    prices: {
      [ShippingZone.PENINSULA]: 20.15,
      [ShippingZone.MALLORCA]: 46.86,
      [ShippingZone.IBIZA_MENORCA]: 65.15,
      [ShippingZone.CANARIAS]: 202.4,
    },
  },
  {
    maxWeight: 90,
    prices: {
      [ShippingZone.PENINSULA]: 22.62,
      [ShippingZone.MALLORCA]: 51.44,
      [ShippingZone.IBIZA_MENORCA]: 72.04,
      [ShippingZone.CANARIAS]: 228.86,
    },
  },
  {
    maxWeight: 100,
    prices: {
      [ShippingZone.PENINSULA]: 25.09,
      [ShippingZone.MALLORCA]: 56.02,
      [ShippingZone.IBIZA_MENORCA]: 78.93,
      [ShippingZone.CANARIAS]: 255.32,
    },
  },
];

@Injectable({
  providedIn: 'root',
})
export class ShippingHandlerService {
  constructor(private shippingCostService: ShippingCostsService) {}

  /**
   * Determina la zona de envío basada en el código postal
   * @param postcode Código postal de destino
   * @returns Zona de envío correspondiente
   */
  private getShippingZone(postcode: string): ShippingZone {
    if (!postcode) {
      return ShippingZone.PENINSULA;
    }

    const codigo = postcode.substring(0, 2);
    const codigoCompleto = parseInt(postcode.substring(0, 5));

    // Canarias: 35xxx (Las Palmas) y 38xxx (Santa Cruz de Tenerife)
    if (codigo === '35' || codigo === '38') {
      return ShippingZone.CANARIAS;
    }

    // Islas Baleares: 07xxx
    if (codigo === '07') {
      // Mallorca: 07000-07699
      if (codigoCompleto >= 7000 && codigoCompleto <= 7699) {
        return ShippingZone.MALLORCA;
      }
      // Ibiza y Menorca: 07700-07999
      if (codigoCompleto >= 7700 && codigoCompleto <= 7999) {
        return ShippingZone.IBIZA_MENORCA;
      }
      // Por defecto, si es 07xxx pero no coincide con los rangos, asumimos Mallorca
      return ShippingZone.MALLORCA;
    }

    // Por defecto, península
    return ShippingZone.PENINSULA;
  }

  /**
   * Calcula el precio de envío basado en el peso del pedido
   * @param weightInGrams Peso total en gramos
   * @param postcode Código postal de destino
   * @returns Precio de envío basado en peso
   * @throws Error si el peso supera los 100kg
   */
  private static readonly GRAMS_TO_KG = 1000;

  private calculatePriceByWeight(
    weightInGrams: number,
    postcode: string
  ): number {
    // Convertir gramos a kilogramos
    const weightInKg = weightInGrams / ShippingHandlerService.GRAMS_TO_KG;

    // Verificar que no supere los 100kg
    if (weightInKg > 100) {
      throw new Error(
        `El peso del pedido (${weightInKg.toFixed(
          2
        )}kg) supera el límite máximo de 100kg`
      );
    }

    // Determinar la zona de envío
    const zone = this.getShippingZone(postcode);

    // Buscar el primer tramo cuyo peso máximo sea igual o superior al peso calculado
    const range = WEIGHT_PRICE_RANGES.find(
      (range) => weightInKg <= range.maxWeight
    );

    if (!range) {
      throw new Error(
        `No se encontró un tramo de peso válido para ${weightInKg.toFixed(2)}kg`
      );
    }

    return range.prices[zone];
  }

  /**
   * Verifica si el pedido contiene elementos de imprenta
   * @param printItems Elementos de imprenta del pedido
   * @returns true si contiene elementos de imprenta, false en caso contrario
   */
  public hasPrintItems(printItems: PrintItems): boolean {
    const {
      flyers = [],
      businessCards = [],
      folders = [],
      diptychs = [],
      triptychs = [],
      rollups = [],
      posters = [],
      magazines = [],
    } = printItems;

    return (
      flyers.length > 0 ||
      businessCards.length > 0 ||
      folders.length > 0 ||
      diptychs.length > 0 ||
      triptychs.length > 0 ||
      rollups.length > 0 ||
      posters.length > 0 ||
      magazines.length > 0
    );
  }

  /**
   * Calcula el costo de envío basado en el peso del pedido
   * @param printItems Elementos de imprenta del pedido
   * @param postcode Código postal de destino
   * @param totalWeightInGrams Peso total en gramos
   * @returns Costo de envío basado en peso
   */
  private calculateWeightBasedShippingCost(
    postcode: string,
    totalWeightInGrams: number
  ): number {
    try {
      const price = this.calculatePriceByWeight(totalWeightInGrams, postcode);

      return price;
    } catch (error) {
      console.error('Error al calcular el precio basado en peso:', error);
      // En caso de error, devolver el costo estándar como fallback
      return generalConfig.SHIPPING_COST;
    }
  }

  /**
   * Calcula el costo de envío estándar basado en el subtotal y código postal
   * @param billing Componente de facturación que contiene el código postal
   * @param shipping Componente de envío opcional (si la dirección es diferente)
   * @param differentAddress Indica si la dirección de envío es diferente de la facturación
   * @param subtotal Subtotal del pedido
   * @param printItems Elementos de imprenta del pedido
   * @param totalWeightInGrams Peso total de los elementos de imprenta en gramos
   * @returns Información sobre disponibilidad y costos de envío
   */
  public calculateShippingCosts(
    billing: any,
    shipping: any,
    differentAddress: boolean,
    subtotal: number,
    printItems?: PrintItems,
    totalWeightInGrams?: number
  ): {
    standardCost: number;
    urgentCost: number;
    standardAvailable: boolean;
    urgentAvailable: boolean;
  } {
    if (!billing) {
      const standardCost = generalConfig.SHIPPING_COST;
      // Si hay elementos de imprenta, no hay envío urgente disponible
      const hasPrintElements = printItems
        ? this.hasPrintItems(printItems)
        : false;

      return {
        standardCost: standardCost,
        urgentCost: hasPrintElements
          ? 0
          : standardCost + generalConfig.URGENT_SHIPPING_PREMIUM,
        standardAvailable: true,
        urgentAvailable: !hasPrintElements,
      };
    }

    const postcode =
      differentAddress && shipping
        ? shipping.shippingDetails.postcode
        : billing.billingDetails.postcode;

    // Si hay elementos de imprenta, el envío urgente no está disponible
    const hasPrintElements = printItems
      ? this.hasPrintItems(printItems)
      : false;
    const urgentAvailable =
      !hasPrintElements &&
      this.shippingCostService.isUrgentShippingAvailable(postcode);
    const standardAvailable = true; // El envío estándar siempre está disponible

    let standardCost: number;

    if (hasPrintElements && totalWeightInGrams !== undefined) {
      // Calculamos el precio basado en peso para elementos de imprenta
      standardCost = this.calculateWeightBasedShippingCost(
        postcode,
        totalWeightInGrams
      );
    } else {
      standardCost = this.shippingCostService.getGastosDeEnvio(
        subtotal,
        postcode
      );
    }

    let urgentCost = hasPrintElements
      ? 0
      : standardCost + generalConfig.URGENT_SHIPPING_PREMIUM;

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
