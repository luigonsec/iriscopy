import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { clearCoupon } from 'src/app/_actions/coupons.actions';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  constructor(
    private store: Store,
    private shopcart: ShopcartService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.analytics.registrarCompra(
      'EUR',
      (localStorage.getItem('coupon') || { code: '' })['code'],
      [...this.shopcart.getCart().copies, ...this.shopcart.getCart().products]
    );
    this.store.dispatch(clearCoupon());
    this.shopcart.clearCart();
  }
}
