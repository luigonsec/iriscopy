import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { clearCoupons } from 'src/app/_actions/coupons.actions';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.scss'],
    standalone: false
})
export class SuccessComponent implements OnInit {
  constructor(
    private store: Store,
    private shopcart: ShopcartService,
    private analytics: AnalyticsService
  ) {}

  async notifyAnalytics() {
    const items = await this.shopcart.getAnalyticsCart();
    this.analytics.registrarCompra(
      'EUR',
      (localStorage.getItem('coupon') || { code: undefined })['code'],
      items
    );
  }

  async ngOnInit() {
    this.notifyAnalytics();
    this.store.dispatch(clearCoupons());
    this.shopcart.clearCart();
  }
}
