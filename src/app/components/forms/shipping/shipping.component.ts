import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import Customer from 'src/app/interfaces/Customer';
import ShippingDetails from 'src/app/interfaces/ShippingDetails';
import { ShippingService } from 'src/app/services/shipping.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss'],
})
export class ShippingComponent implements OnDestroy {
  @Input('onUpdatePostalCode') onUpdatePostalCode: () => void = () => {};

  public shippingDetails: ShippingDetails = {} as ShippingDetails;
  public shippingDetailsErrors: ShippingDetails = {} as ShippingDetails;
  public subcription: Subscription;

  constructor(
    private shippingService: ShippingService,
    private messageService: MessageService,
    private store: Store
  ) {
    this.resetShippingDetails();
    this.subcription = this.store
      .select(selectCustomer)
      .subscribe((customer: Customer) => {
        this.resetShippingDetails();
        if (customer) {
          this.shippingDetails = Object.assign({}, customer.shipping);
        }
      });
  }

  public validate() {
    Object.keys(this.shippingDetails).forEach((key) => {
      if (this.shippingDetails[key])
        this.shippingDetails[key] = this.shippingDetails[key].trim();
    });
    const validShipping = this.validShipping();

    if (!validShipping) {
      return this.messageService.add({
        severity: 'error',
        detail: 'Hay errores en los "DATOS DE ENVÍO"',
        summary: 'Error',
      });
    }
    return validShipping;
  }

  private validShipping() {
    this.shippingDetailsErrors = this.shippingService.validate(
      this.shippingDetails
    );

    const shippingFine = Object.keys(this.shippingDetailsErrors)
      .map((x) => this.shippingDetailsErrors[x])
      .every((x) => !x);

    return shippingFine;
  }

  public resetShippingDetails() {
    this.shippingDetails = {
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

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  ngOnInit(): void {}
}
