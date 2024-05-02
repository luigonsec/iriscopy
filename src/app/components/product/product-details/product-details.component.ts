import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import Product from 'src/app/interfaces/Product';
import ProductVariation from 'src/app/interfaces/ProductVariation';
import { ProductsService } from 'src/app/services/products.service';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  public product: Product;
  public variations: ProductVariation[];
  public selectedAttribute: string;
  public picture: string;
  public selectedVariation: ProductVariation;

  public quantity: number = 0;

  constructor(
    private shopCart: ShopcartService,
    private conf: DynamicDialogConfig,
    private productService: ProductsService
  ) {
    this.product = this.conf.data.product;
  }

  addToCart() {
    if (this.quantity <= 0) return;
    this.shopCart.addProductToCart({
      product: this.product,
      variation: this.selectedVariation,
      quantity: this.quantity,
    });
    this.quantity = 0;
  }

  hasAttributes() {
    return this.product.attributes.length > 0;
  }

  hasVariations() {
    return this.product.variations.length > 0;
  }

  buttonDisabled() {
    if (
      this.hasAttributes() &&
      this.hasVariations() &&
      !this.selectedVariation
    ) {
      return true;
    }

    if (
      this.hasAttributes() &&
      !this.hasVariations() &&
      !this.selectedAttribute
    ) {
      return true;
    }

    return false;
  }

  selectVariation(variation) {
    console.log(variation);

    this.selectedVariation = variation;
    this.picture = variation.image.src;
  }

  ngOnInit() {
    this.picture = this.product.images[0]?.src;

    if (this.product.variations.length) {
      this.productService
        .getVariations(this.product.id)
        .subscribe((variations: ProductVariation[]) => {
          this.variations = variations;
        });
    }
  }
}
