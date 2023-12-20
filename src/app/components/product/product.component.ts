import { Component, Input, OnInit } from '@angular/core';
import Product from 'src/app/interfaces/Product';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  constructor(private shopCart: ShopcartService) {}

  @Input('product') product: Product;
  public quantity: number = 0;

  addToCart() {
    if (this.quantity == 0) return;
    this.shopCart.addProductToCart({
      product: this.product,
      quantity: this.quantity,
    });
    this.quantity = 0;
  }

  ngOnInit(): void {}
}
