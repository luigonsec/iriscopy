import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import Product from 'src/app/interfaces/Product';
import ProductVariation from 'src/app/interfaces/ProductVariation';
import { ProductsService } from 'src/app/services/products.service';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-shop-product',
  templateUrl: './shop-product.component.html',
  styleUrls: ['./shop-product.component.scss'],
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
    private titleService: Title,
    private shopCart: ShopcartService,
    private productsService: ProductsService,
    private router: ActivatedRoute,
    private meta: Meta
  ) {}

  adjustFieldsSEO() {
    this.titleService.setTitle(this.product.name);

    // Metadatos Open Graph
    this.meta.addTags([
      { property: 'og:title', content: this.product.name },
      { property: 'og:description', content: this.product.short_description },
      { property: 'og:image', content: this.picture }, // URL de la imagen del producto
      { property: 'og:url', content: window.location.href },
      { property: 'og:type', content: 'website' },
    ]);
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
      this.product = product;
      this.adjustFieldsSEO();
      this.picture = this.product.images[0]?.src;
      this.loadVariations();
    });
  }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.slug = params.slug;
      this.loadProduct();
    });
  }
}
