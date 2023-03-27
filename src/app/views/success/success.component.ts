import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { clearCoupon } from 'src/app/_actions/coupons.actions';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  constructor(private store: Store, private shopcart: ShopcartService) {}

  ngOnInit(): void {
    this.store.dispatch(clearCoupon());
    this.shopcart.clearCart();
  }
}
