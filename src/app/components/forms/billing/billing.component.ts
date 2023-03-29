import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import BillingDetails from 'src/app/interfaces/BillingDetails';
import { BillingService } from 'src/app/services/billing.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent {
  public emptyCart: boolean = false;
  public billingDetails: BillingDetails = {} as BillingDetails;
  public billingDetailsErrors: BillingDetails = {} as BillingDetails;
  public formGroup;

  constructor(
    private billingService: BillingService,
    private messageService: MessageService,
    private store: Store
  ) {
    this.resetBillingDetails();
    this.store.select(selectCustomer).subscribe((data) => {
      if (data) {
        this.billingDetails = Object.assign({}, data.billing);
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
    const validBilling = this.validBilling();
    if (!!!validBilling)
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
      (x) => !!!x
    );
    return billingFine;
  }

  ngOnInit(): void {}
}
