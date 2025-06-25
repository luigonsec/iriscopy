import { Injectable } from '@angular/core';
import { OrderCopy } from '../interfaces/OrderCopy';
import OrderProduct from '../interfaces/OrderProduct';
import ShippingLine from '../interfaces/ShippingLine';
import Location from '../interfaces/Location';
import File from '../interfaces/File';
import Order from '../interfaces/Order';
import Coupon from '../interfaces/Coupon';
import { BillingComponent } from '../components/forms/billing/billing.component';
import { ShippingComponent } from '../components/forms/shipping/shipping.component';
import Customer from '../interfaces/Customer';

@Injectable({
  providedIn: 'root',
})
export class OrderBuilderService {
  constructor() {}

  /**
   * Obtiene la línea de envío para el pedido
   * @param deliver Método de entrega
   * @param selectedLocation Ubicación seleccionada para recogida
   * @returns Objeto ShippingDetails con la información de envío
   */
  public getShippingLine(
    deliver: string,
    selectedLocation?: Location
  ): ShippingLine {
    const shippingLine = {} as ShippingLine;

    if (deliver === 'Pickup') {
      this.setPickupProperties(shippingLine, selectedLocation);
    } else {
      this.setShippingProperties(shippingLine, deliver);
    }

    return shippingLine;
  }

  /**
   * Configura las propiedades para envío a domicilio
   * @param shippingLine Objeto de línea de envío a configurar
   * @param deliver Método de entrega (Shipping o UrgentShipping)
   */
  private setShippingProperties(shippingLine: ShippingLine, deliver: string) {
    shippingLine.method_title =
      deliver == 'UrgentShipping' ? 'Envío urgente' : 'Envío en 48 horas';
    shippingLine.method_id =
      deliver == 'UrgentShipping' ? 'urgent_flat_rate' : 'flat_rate';
    // instance_id no está en la interfaz ShippingLine
    (shippingLine as any).instance_id = '9';
    shippingLine.total_tax = '0.00';
  }

  /**
   * Configura las propiedades para recogida en tienda
   * @param shippingLine Objeto de línea de envío a configurar
   * @param selectedLocation Ubicación seleccionada para recogida
   */
  private setPickupProperties(
    shippingLine: ShippingLine,
    selectedLocation: Location
  ) {
    shippingLine.method_title = 'Local de Recogida';
    shippingLine.method_id = 'local_pickup_plus';
    shippingLine.total = '0.00';
    shippingLine.total_tax = '0.00';

    // Añadir meta_data como un campo adicional ya que no está en la interfaz ShippingLine
    if (selectedLocation) {
      (shippingLine as any).meta_data = [
        {
          key: '_pickup_location_id',
          value: selectedLocation.id,
        },
      ];
    }
  }

  /**
   * Aplana los archivos de las copias en una sola lista
   * @param copies Lista de pedidos de copias
   * @returns Lista plana de archivos
   */
  public getFlattenFiles(copies: OrderCopy[]): File[] {
    return copies
      .map((order) => order.files)
      .reduce((acc, val) => acc.concat(val), []);
  }

  /**
   * Construye el objeto de pedido completo
   * @param customer Cliente que realiza el pedido
   * @param coupon Cupón aplicado al pedido
   * @param billing Componente de datos de facturación
   * @param shipping Componente de datos de envío
   * @param differentAddress Indica si la dirección de envío es diferente de la de facturación
   * @param copies Lista de pedidos de copias
   * @param products Lista de pedidos de productos
   * @param payment Método de pago seleccionado
   * @param deliver Método de entrega seleccionado
   * @param selectedLocation Ubicación seleccionada para recogida
   * @returns Objeto Order completo
   */
  public buildOrderObject(
    customer: Customer,
    coupons: Coupon[],
    billing: BillingComponent,
    shipping: ShippingComponent,
    differentAddress: boolean,
    copies: OrderCopy[],
    products: OrderProduct[],
    payment: string,
    deliver: string,
    selectedLocation: Location
  ): Order {
    // Obtener línea de envío y aplanar archivos
    const shippingLine = this.getShippingLine(deliver, selectedLocation);
    const flattenFiles = this.getFlattenFiles(copies);

    // Construir y devolver el objeto de pedido
    const customer_id = customer ? customer.id : 0;
    return {
      customer_id,
      coupons,
      billing: billing.billingDetails,
      shipping: differentAddress
        ? shipping.shippingDetails
        : billing.billingDetails,
      copies,
      products,
      payment_method: payment,
      payment_method_title: payment,
      shipping_lines: [shippingLine],
      meta_data: [
        {
          key: '_wcuf_uploaded_files',
          value: {
            '0-37198-37595': {
              id: '0-37198-37595',
              quantity: flattenFiles.map(() => '1'),
              original_filename: flattenFiles.map(
                (x: File) => x.original_filename
              ),
              url: flattenFiles.map((x: File) => x.url),
              source: flattenFiles.map((x: File) => x.source),
              num_uploaded_files: flattenFiles.length,
              user_feedback: '',
              is_multiple_file_upload: true,
            },
          },
        },
      ],
    };
  }
}
