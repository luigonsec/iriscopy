/**
 * Interfaz para representar el resultado de las llamadas del servicio de precios
 */
export interface PriceResult {
  precio: number;
  weight: number;
  notas: string[];
}
