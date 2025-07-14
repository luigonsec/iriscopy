import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { ShopcartService } from 'src/app/services/shopcart.service';
import Product from 'src/app/interfaces/Product';
import ProductVariation from 'src/app/interfaces/ProductVariation';
import { AnalyticsService } from '../../../services/analytics.service';

@Component({
    selector: 'app-shop-product',
    templateUrl: './shop-product.component.html',
    styleUrls: ['./shop-product.component.scss'],
    standalone: false
})
export class ShopProductComponent implements OnInit {
  public slug: string = undefined;
  public product: Product;
  public variations: ProductVariation[] = [];
  public selectedAttribute: string;
  public picture: string;
  public selectedVariation: ProductVariation;
  public quantity: number = 0;

  constructor(
    public shopCart: ShopcartService,
    public productsService: ProductsService,
    public activatedRouter: ActivatedRoute,
    public analytics: AnalyticsService,
    public router: Router
  ) {}

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
    this.selectedVariation = variation;
    this.picture = variation.image.src;
  }

  loadVariations() {
    if (this.product.variations.length) {
      this.productsService
        .getVariations(this.product.id)
        .subscribe((variations: ProductVariation[]) => {
          this.variations = variations;
        });
    }
  }

  loadProduct() {
    this.productsService.findBySlug(this.slug).subscribe((product: Product) => {
      if (!!!product) {
        return this.router.navigate(['/']);
      }
      this.product = product;
      this.picture = this.product.images[0]?.src;
      this.notifyAnalytics();
      this.loadVariations();
    });
  }

  notifyAnalytics() {
    this.analytics.verDetalleProducto([
      {
        item_id: this.product.id,
        item_name: this.product.name,
        item_category: this.product.categories,
        price: +this.product.price,
      },
    ]);
  }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.slug = params.slug;
      if (this.slug) {
        this.loadProduct();
      }
    });
  }
}
