import { Component } from '@angular/core';
import { ShopcartService } from './services/shopcart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private shopCart: ShopcartService) {}

  ngOnInit(): void {
    const cartIsValid = this.shopCart.validate();
    if (!cartIsValid) {
      this.shopCart.clearCart();
    }
  }
}
