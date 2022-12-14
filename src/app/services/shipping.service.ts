import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import ShippingDetails from '../interfaces/ShippingDetails';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  constructor() {}

  validate(shipping: ShippingDetails) {
    const errors: ShippingDetails = {
      first_name: undefined,
      company: undefined,
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

    const invalidName = new FormControl(
      shipping.first_name.trim(),
      Validators.required
    );
    if (invalidName.errors) {
      errors.first_name = 'Este campo no puede estar vacío';
    }

    const invalidCIF = new FormControl(
      shipping.company.trim(),
      Validators.required
    );
    if (invalidCIF.errors) {
      errors.company = 'Este campo no puede estar vacío';
    }

    const invalidAddress = new FormControl(
      shipping.address_1.trim(),
      Validators.required
    );
    if (invalidAddress.errors) {
      errors.address_1 = 'Este campo no puede estar vacío';
    }

    const invalidAddress2 = new FormControl(
      shipping.address_1.trim(),
      Validators.required
    );
    if (invalidAddress2.errors) {
      errors.address_2 = 'Este campo no puede estar vacío';
    }

    const invalidCity = new FormControl(
      shipping.city.trim(),
      Validators.required
    );
    if (invalidCity.errors) {
      errors.city = 'Este campo no puede estar vacío';
    }

    const invalidPostalCode = new FormControl(
      shipping.postcode.trim(),
      Validators.required
    );
    if (invalidPostalCode.errors) {
      errors.postcode = 'Este campo no puede estar vacío';
    }

    return errors;
  }
}
