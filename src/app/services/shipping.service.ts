import { Injectable } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import ShippingDetails from '../interfaces/ShippingDetails';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  constructor() {}

  validate(shipping: ShippingDetails) {
    const errors: ShippingDetails = {
      first_name: undefined,
      last_name: undefined,
      responsible: undefined,
      email: undefined,
      address_1: undefined,
      address_2: undefined,
      city: undefined,
      postcode: undefined,
      phone: undefined,
      state: undefined,
      others: undefined,
    };

    const invalidName = new UntypedFormControl(
      shipping.first_name.trim(),
      Validators.required
    );
    if (invalidName.errors) {
      errors.first_name = 'Este campo no puede estar vacío';
    }

    const invalidCIF = new UntypedFormControl(
      shipping.last_name.trim(),
      Validators.required
    );
    if (invalidCIF.errors) {
      errors.last_name = 'Este campo no puede estar vacío';
    }

    const invalidAddress = new UntypedFormControl(
      shipping.address_1.trim(),
      Validators.required
    );
    if (invalidAddress.errors) {
      errors.address_1 = 'Este campo no puede estar vacío';
    }

    const invalidAddress2 = new UntypedFormControl(
      shipping.address_1.trim(),
      Validators.required
    );
    if (invalidAddress2.errors) {
      errors.address_2 = 'Este campo no puede estar vacío';
    }

    const invalidCity = new UntypedFormControl(
      shipping.city.trim(),
      Validators.required
    );
    if (invalidCity.errors) {
      errors.city = 'Este campo no puede estar vacío';
    }

    const invalidPostalCode = new UntypedFormControl(
      shipping.postcode.trim(),
      Validators.required
    );
    if (invalidPostalCode.errors) {
      errors.postcode = 'Este campo no puede estar vacío';
    }
    if (isNaN(+shipping.postcode.trim())) {
      errors.postcode = 'El código postal debe ser numérico';
    }
    return errors;
  }
}
