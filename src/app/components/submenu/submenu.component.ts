import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { logout } from 'src/app/_actions/customer.actions';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import Customer from 'src/app/interfaces/Customer';
import { OrderItem } from 'src/app/interfaces/OrderItem';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss'],
})
export class SubmenuComponent implements OnInit {
  customer$: Subscription;
  customer: Customer;
  public orders: OrderItem[];

  constructor(
    private router: Router,
    private store: Store,
    private shopcartService: ShopcartService
  ) {
    this.orders = [];

    this.customer$ = this.store
      .select(selectCustomer)
      .subscribe((customer: Customer) => {
        this.customer = customer;
      });
  }

  subscribeCart() {
    this.shopcartService.getCart$().subscribe((orders: OrderItem[]) => {
      this.orders = orders;
    });
  }

  // ...

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {
    this.orders = this.shopcartService.getCart();
    this.subscribeCart();
  }
}
