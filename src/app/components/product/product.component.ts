import { Component, Input, OnInit } from '@angular/core';
import Product from 'src/app/interfaces/Product';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductDetailsComponent } from './product-details/product-details.component';

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

  constructor(
    private shopCart: ShopcartService,
    private dialogService: DialogService
  ) {}

  addToCart() {
    if (this.quantity == 0) return;
    this.shopCart.addProductToCart({
      product: this.product,
      quantity: this.quantity,
    });
    this.quantity = 0;
  }

  openDetails() {
    const isMobile = window.innerWidth < 768; // Considera móvil si el ancho es menor a 768px
    const dialogWidth = isMobile ? '90%' : '50%'; // Ancho del 90% para móviles, 50% para PC

    this.dialogService.open(ProductDetailsComponent, {
      width: dialogWidth,
      header: this.product.name,
      data: { product: this.product },
    });
  }

  ngOnInit(): void {}
}
