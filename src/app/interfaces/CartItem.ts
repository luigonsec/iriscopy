/**
 * Interfaz base para todos los elementos del carrito
 * Todos los elementos de carrito deben ser compatibles con estas propiedades
 */
export default interface CartItem {
  id?: string; // Haciendo id opcional ya que algunas interfaces lo tienen como opcional
  copiesQuantity?: number;
  product?: any; // Para OrderProduct
  quantity?: number; // Para OrderProduct
  [key: string]: any; // Para permitir propiedades adicionales de diferentes tipos de productos
}
