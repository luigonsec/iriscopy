import { Injectable } from '@angular/core';
import mallorca from 'src/config/mallorca';
import menorca from 'src/config/menorca';
import ibiza from 'src/config/ibiza';
import formentera from 'src/config/formentera';
import generalConfig from 'src/config/general';

@Injectable({
  providedIn: 'root',
})
export class ShippingCostsService {
  constructor() {}

  public getGastosDeEnvio(subtotal, postcode) {
    let precioEnvio = generalConfig.SHIPPING_COST;
    const numericCode = +postcode;
    if (
      (numericCode >= 35000 && numericCode < 36000) ||
      (numericCode >= 38000 && numericCode < 39000)
    ) {
      precioEnvio = this.getGastosEnvioCanarias();
    } else if (mallorca.includes(numericCode))
      precioEnvio = this.getGastosEnvioMallorca();
    else if (ibiza.includes(numericCode))
      precioEnvio = this.getGastosEnvioIbiza();
    else if (menorca.includes(numericCode))
      precioEnvio = this.getGastosEnvioMenorca();
    else if (formentera.includes(numericCode))
      precioEnvio = this.getGastosEnvioFormentera();
    else precioEnvio = this.getGastosEnvioPeninsula(subtotal);

    return precioEnvio;
  }

  public getGastosEnvioPeninsula(subtotal) {
    const precioPedido = subtotal;
    if (precioPedido > 0 && precioPedido < 15) return 4.9;
    if (precioPedido >= 15 && precioPedido < 25) return 3.9;
    if (precioPedido >= 25 && precioPedido < 35) return 2.9;
    if (precioPedido >= 35) return 0;
    return 4.9;
  }

  public getGastosEnvioCanarias() {
    return 35;
  }

  public getGastosEnvioMallorca() {
    return 10.3;
  }

  public getGastosEnvioMenorca() {
    return 11.9;
  }

  public getGastosEnvioIbiza() {
    return 11.9;
  }

  public getGastosEnvioFormentera() {
    return 14.4;
  }
}
