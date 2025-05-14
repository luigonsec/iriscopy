import { Injectable } from '@angular/core';
import generalConfig from 'src/config/general';
import { LocationsService } from './locations.service';

@Injectable({
  providedIn: 'root',
})
export class ShippingCostsService {
  constructor(private locationsService: LocationsService) {}

  public isUrgentShippingAvailable(postcode) {
    if (this.locationsService.isCanarias(postcode)) {
      return false;
    }
    if (this.locationsService.isBaleares(postcode)) {
      return false;
    }
    return true;
  }

  public isStandarShippingAvailable(postcode) {
    if (this.locationsService.isCanarias(postcode)) {
      return false;
    }
    return true;
  }

  public getGastosDeEnvio(subtotal, postcode) {
    let precioEnvio = generalConfig.SHIPPING_COST;
    if (this.locationsService.isCanarias(postcode)) {
      precioEnvio = this.getGastosEnvioCanarias();
    } else if (this.locationsService.isMallorca(postcode))
      precioEnvio = this.getGastosEnvioMallorca();
    else if (this.locationsService.isIbiza(postcode))
      precioEnvio = this.getGastosEnvioIbiza();
    else if (this.locationsService.isMenorca(postcode))
      precioEnvio = this.getGastosEnvioMenorca();
    else if (this.locationsService.isFormentera(postcode))
      precioEnvio = this.getGastosEnvioFormentera();
    else precioEnvio = this.getGastosEnvioPeninsula(subtotal);

    return precioEnvio;
  }

  public getGastosEnvioPeninsula(subtotal) {
    const precioPedido = subtotal;
    if (precioPedido > 0 && precioPedido < 15) return 4.9;
    if (precioPedido >= 15 && precioPedido < 25) return 3.9;
    if (precioPedido >= 25 && precioPedido < 39) return 2.9;
    if (precioPedido >= 39) return 0;
    return 4.9;
  }

  public getGastosEnvioCanarias() {
    return 23;
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
