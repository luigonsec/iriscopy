import { TestBed } from '@angular/core/testing';

import { ShippingCostsService } from './shipping-costs.service';

describe('ShippingCostsService', () => {
  let service: ShippingCostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingCostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
