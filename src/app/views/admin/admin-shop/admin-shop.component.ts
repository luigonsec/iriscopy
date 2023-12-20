import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import ProductCategory from 'src/app/interfaces/ProductCategory';
import { ConfigService } from 'src/app/services/config.service';
import { ProductCategoriesService } from 'src/app/services/product-categories.service';

@Component({
  selector: 'app-admin-shop',
  templateUrl: './admin-shop.component.html',
  styleUrls: ['./admin-shop.component.scss'],
})
export class AdminShopComponent implements OnInit {
  categories: ProductCategory[];
  shop_active: boolean = false;
  constructor(
    private messageService: MessageService,
    private productCategories: ProductCategoriesService,
    private config: ConfigService
  ) {}

  getCategories() {
    this.productCategories
      .getAll()
      .subscribe((categories: ProductCategory[]) => {
        this.categories = categories;
      });
  }

  getConfig() {
    this.config.getConfig().subscribe((config: { shop_active: boolean }) => {
      this.shop_active = config.shop_active;
    });
  }

  manageShopStatus($event) {
    this.config.updateConfig({ shop_active: $event.checked }).subscribe(() => {
      this.getConfig();
    });
  }

  manageCategoryStatus($event, category: ProductCategory) {
    this.productCategories
      .update(category, { active: $event.checked })
      .subscribe({
        next: () => {
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: `La categoría ${category.name} ha sido ${
              $event.checked ? 'activada' : 'desactivada'
            }`,
          });
        },
        error: () => {
          this.getCategories();
          this.messageService.add({
            severity: 'Error',
            summary: 'Error',
            detail: `La categoría ${category.name} no ha podido ser actualizada`,
          });
        },
      });
  }

  ngOnInit(): void {
    this.getConfig();
    this.getCategories();
  }
}
