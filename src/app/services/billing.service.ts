import { Injectable } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import BillingDetails from '../interfaces/BillingDetails';

@Injectable({
	providedIn: 'root',
})
export class BillingService {
	constructor() {}

	validate(billing: BillingDetails, isShipping: boolean) {
		const errors: BillingDetails = {
			first_name: undefined,
			last_name: undefined,
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

		const invalidName = new UntypedFormControl(
			billing.first_name.trim(),
			Validators.required
		);
		if (invalidName.errors) {
			errors.first_name = 'Este campo no puede estar vacío';
		}

		const invalidCIF = new UntypedFormControl(
			billing.last_name.trim(),
			Validators.required
		);
		if (invalidCIF.errors) {
			errors.last_name = 'Este campo no puede estar vacío';
		}

		const invalidAddress = new UntypedFormControl(
			billing.address_1.trim(),
			Validators.required
		);
		if (invalidAddress.errors && isShipping) {
			errors.address_1 = 'Este campo no puede estar vacío';
		}

		const invalidAddress2 = new UntypedFormControl(
			billing.address_2.trim(),
			Validators.required
		);
		if (invalidAddress2.errors && isShipping) {
			errors.address_2 = 'Este campo no puede estar vacío';
		}

		const invalidCity = new UntypedFormControl(
			billing.city.trim(),
			Validators.required
		);
		if (invalidCity.errors && isShipping) {
			errors.city = 'Este campo no puede estar vacío';
		}

		const invalidPostalCode = new UntypedFormControl(
			billing.postcode.trim(),
			Validators.required
		);
		if (invalidPostalCode.errors && isShipping) {
			errors.postcode = 'Este campo no puede estar vacío';
		}
		if (isNaN(+billing.postcode.trim()) && isShipping) {
			errors.postcode = 'El código postal debe ser numérico';
		} 

		const invalidPhone = new UntypedFormControl(
			billing.phone.trim(),
			Validators.required
		);
		if (invalidPhone.errors) {
			errors.phone = 'Este campo no puede estar vacío';
		}

		const emptyEmail = new UntypedFormControl(
			billing.email.trim(),
			Validators.required
		);
		if (emptyEmail.errors) {
			errors.email = 'Este campo no puede estar vacío';
		}

		const invalidEmail = new UntypedFormControl(
			billing.email.trim(),
			Validators.email
		);
		if (invalidEmail.errors) {
			errors.email = 'El email introducido no es válido';
		}

		return errors;
	}
}
