import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { clearCoupons } from 'src/app/_actions/coupons.actions';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(clearCoupons());
  }
}
