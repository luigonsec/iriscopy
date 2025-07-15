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
import { OrderItems } from '../interfaces/OrderItems';
import { OrderBuilderParams } from '../interfaces/OrderBuilderParams';

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
   * Aplana los archivos de cualquier tipo de pedido que contenga files
   * @param items Lista de elementos que contengan archivos
   * @returns Lista plana de archivos
   */
  public getFlattenFiles(items: any[]): File[] {
    if (!items || items.length === 0) return [];

    return items
      .filter((item) => item.files && item.files.length > 0)
      .map((item) => item.files)
      .reduce((acc, val) => acc.concat(val), []);
  }

  /**
   * Obtiene todos los archivos de todos los tipos de pedidos
   * @param orderItems Objeto con todos los tipos de pedidos
   * @returns Lista plana de todos los archivos
   */
  public getAllFlattenFiles(orderItems: OrderItems): File[] {
    const allFiles: File[] = [];

    // Agregar archivos de copias
    if (orderItems.copies) {
      allFiles.push(...this.getFlattenFiles(orderItems.copies));
    }

    // Agregar archivos de otros tipos de pedidos que contengan files
    const itemTypesWithFiles = [
      orderItems.flyers,
      orderItems.businessCards,
      orderItems.folders,
      orderItems.diptychs,
      orderItems.triptychs,
      orderItems.rollups,
      orderItems.posters,
      orderItems.magazines,
    ];

    itemTypesWithFiles.forEach((items) => {
      if (items) {
        allFiles.push(...this.getFlattenFiles(items));
      }
    });

    return allFiles;
  }

  /**
   * Construye el objeto de pedido completo
   * @param params Parámetros unificados para construir el pedido
   * @returns Objeto Order completo
   */
  public buildOrderObject(params: OrderBuilderParams): Order {
    const {
      customer,
      coupons,
      billing,
      shipping,
      differentAddress,
      orderItems,
      payment,
      deliver,
      selectedLocation,
    } = params;

    // Obtener línea de envío y aplanar archivos
    const shippingLine = this.getShippingLine(deliver, selectedLocation);
    const flattenFiles = this.getAllFlattenFiles(orderItems);

    // Construir y devolver el objeto de pedido
    const customer_id = customer ? customer.id : 0;
    return {
      customer_id,
      coupons,
      billing: billing.billingDetails,
      shipping: differentAddress
        ? shipping.shippingDetails
        : billing.billingDetails,
      copies: orderItems.copies || [],
      products: orderItems.products || [],
      flyers: orderItems.flyers || [],
      businessCards: orderItems.businessCards || [],
      folders: orderItems.folders || [],
      diptychs: orderItems.diptychs || [],
      triptychs: orderItems.triptychs || [],
      rollups: orderItems.rollups || [],
      posters: orderItems.posters || [],
      magazines: orderItems.magazines || [],
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

  /**
   * @deprecated Usar buildOrderObject(params: OrderBuilderParams) en su lugar
   * Método de compatibilidad hacia atrás para la versión anterior
   */
  public buildOrderObjectLegacy(
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
    return this.buildOrderObject({
      customer,
      coupons,
      billing,
      shipping,
      differentAddress,
      orderItems: {
        copies: copies || [],
        products: products || [],
      },
      payment,
      deliver,
      selectedLocation,
    });
  }
}
