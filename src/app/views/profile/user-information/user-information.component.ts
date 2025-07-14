import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BillingComponent } from 'src/app/components/forms/billing/billing.component';
import { ShippingComponent } from 'src/app/components/forms/shipping/shipping.component';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
    selector: 'app-user-information',
    templateUrl: './user-information.component.html',
    styleUrls: ['./user-information.component.scss'],
    standalone: false
})
export class UserInformationComponent {
  @ViewChild('billing') billing: BillingComponent;
  @ViewChild('shipping') shipping: ShippingComponent;
  public firstLogin: boolean = false;

  constructor(
    private customersService: CustomersService,
    private messages: MessageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.firstLogin = params.signup == 'true';
    });
  }

  manageBilling() {
    const isValid = this.billing.validate();
    if (isValid) {
      this.customersService
        .update(1, { billing: this.billing.billingDetails })
        .subscribe({
          next: () => {
            this.messages.add({
              severity: 'success',
              summary: 'Tus datos de facturación han sido actualizados',
              detail: 'Datos actualizados',
            });
          },
          error: () => {
            this.messages.add({
              severity: 'error',
              summary:
                'Tus datos de facturación no han podido ser actualizados',
              detail: 'Error',
            });
          },
        });
    }
  }

  manageShipping() {
    const isValid = this.shipping.validate();
    if (isValid) {
      this.customersService
        .update(1, {
          shipping: this.shipping.shippingDetails,
        })
        .subscribe({
          next: () => {
            this.messages.add({
              severity: 'success',
              summary: 'Tus datos de envío han sido actualizados',
              detail: 'Datos actualizados',
            });
          },
          error: () => {
            this.messages.add({
              severity: 'error',
              summary: 'Tus datos de envío no han podido ser actualizados',
              detail: 'Error',
            });
          },
        });
    }
  }
}
