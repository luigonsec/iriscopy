import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShippingCostsService {
  constructor() {}

  public getGastosEnvioCanarias() {
    return 35;
  }

  public getGastosEnvioAljarafe(precioPedido) {
    if (precioPedido > 0 && precioPedido < 10) return 4.9;
    if (precioPedido >= 10 && precioPedido < 25) return 3.9;
    if (precioPedido >= 25 && precioPedido < 40) return 2.9;
    if (precioPedido >= 40) return 0;
    return 4.9;
  }

  public getGastosEnvioSevilla(precioPedido) {
    if (precioPedido > 0 && precioPedido < 10) return 4.9;
    if (precioPedido >= 10 && precioPedido < 25) return 1.9;
    if (precioPedido >= 25 && precioPedido < 40) return 0.9;
    if (precioPedido >= 40) return 0;
    return 4.9;
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
