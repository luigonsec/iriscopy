import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import BillingDetails from 'src/app/interfaces/BillingDetails';
import Customer from 'src/app/interfaces/Customer';
import { BillingService } from 'src/app/services/billing.service';

@Component({
	selector: 'app-billing',
	templateUrl: './billing.component.html',
	styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnDestroy {
	public emptyCart: boolean = false;
	public billingDetails: BillingDetails = {} as BillingDetails;
	public billingDetailsErrors: BillingDetails = {} as BillingDetails;
	public subcription: Subscription;

	constructor(
    private billingService: BillingService,
    private messageService: MessageService,
    private store: Store
	) {
		this.resetBillingDetails();
		this.subcription = this.store
			.select(selectCustomer)
			.subscribe((customer: Customer) => {
				this.resetBillingDetails();
				if (customer) {
					this.billingDetails = Object.assign({}, customer.billing);
				}
			});
	}

	public resetBillingDetails() {
		this.billingDetails = {
			first_name: '',
			last_name: '',
			company: '',
			responsible: '',
			address_1: '',
			address_2: '',
			city: '',
			email: '',
			phone: '',
			others: '',
			postcode: '',
			state: '',
		};
	}

	public validate() {
		Object.keys(this.billingDetails).forEach((key) => {
			if (this.billingDetails[key])
				this.billingDetails[key] = this.billingDetails[key].trim();
		});

		const validBilling = this.validBilling();
		if (!validBilling)
			return this.messageService.add({
				severity: 'error',
				detail: 'Hay errores en los "DETALLES DE FACTURACIÓN"',
				summary: 'Error',
			});
		return validBilling;
	}

	private validBilling() {
		this.billingDetailsErrors = this.billingService.validate(
			this.billingDetails
		);
		const billingFine = Object.values(this.billingDetailsErrors).every(
			(x) => !x
		);
		return billingFine;
	}

	ngOnDestroy(): void {
		this.subcription.unsubscribe();
	}

	ngOnInit(): void {}
}
