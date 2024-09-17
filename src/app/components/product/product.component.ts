import { Component, Input, OnInit } from '@angular/core';
import Product from 'src/app/interfaces/Product';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [DialogService],
})
export class ProductComponent implements OnInit {
  @Input('product') product: Product;
  public quantity: number = 0;
  ref: DynamicDialogRef | undefined;

  constructor(private shopCart: ShopcartService, private router: Router) {}

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
