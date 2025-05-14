import mallorca from 'src/config/mallorca';
import menorca from 'src/config/menorca';
import ibiza from 'src/config/ibiza';
import formentera from 'src/config/formentera';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  public isCanarias(postcode) {
    const numericCode = +postcode;
    return (
      (numericCode >= 35000 && numericCode < 36000) ||
      (numericCode >= 38000 && numericCode < 39000)
    );
  }
  public isBaleares(postcode) {
    const numericCode = +postcode;
    return (
      ibiza.includes(numericCode) ||
      menorca.includes(numericCode) ||
      formentera.includes(numericCode) ||
      mallorca.includes(numericCode)
    );
  }

  isMallorca(postcode) {
    const numericCode = +postcode;
    return mallorca.includes(numericCode);
  }
  isMenorca(postcode) {
    const numericCode = +postcode;
    return menorca.includes(numericCode);
  }
  isIbiza(postcode) {
    const numericCode = +postcode;
    return ibiza.includes(numericCode);
  }
  isFormentera(postcode) {
    const numericCode = +postcode;
    return formentera.includes(numericCode);
  }
}
