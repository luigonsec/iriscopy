import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsEmptyCartWarningComponent } from './payments-empty-cart-warning.component';

describe('PaymentsEmptyCartWarningComponent', () => {
  let component: PaymentsEmptyCartWarningComponent;
  let fixture: ComponentFixture<PaymentsEmptyCartWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsEmptyCartWarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsEmptyCartWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
