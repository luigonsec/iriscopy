import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { map, tap } from 'rxjs';
import Product from 'src/app/interfaces/Product';
import ProductCategory from 'src/app/interfaces/ProductCategory';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductCategoriesService } from 'src/app/services/product-categories.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-shop-index',
  templateUrl: './shop-index.component.html',
  styleUrls: ['./shop-index.component.scss'],
})
export class ShopIndexComponent implements OnInit {
  items: MenuItem[] = [];
  filters: MenuItem[] = [];
  categories: MenuItem[];
  products: Product[] = [];

  constructor(
    private productsService: ProductsService,
    private categoriesService: ProductCategoriesService,
    private loading: LoadingService
  ) {}

  public loadProducts(id) {
    this.products = [];
    return this.productsService.getByCategory(id).pipe(
      tap((products: Product[]) => {
        this.products = products;
      })
    );
  }

  public loadAllProducts() {
    this.products = [];
    return this.productsService.getAll().pipe(
      tap((products: Product[][]) => {
        this.products = products.reduce((a, b) => [...a, ...b], []);
        console.log(this.products);
      })
    );
  }

  public sortByPriceMenor() {
    this.products = this.products.sort((a, b) => {
      return parseFloat(a.price) - parseFloat(b.price);
    });
  }

  public sortByPriceMayor() {
    this.products = this.products.sort((a, b) => {
      return parseFloat(b.price) - parseFloat(a.price);
    });
  }

  public sortByNameAZ() {
    this.products = this.products.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  public sortByNameZA() {
    this.products = this.products.sort((a, b) => {
      return b.name.localeCompare(a.name);
    });
  }

  loadCategories() {
    return this.categoriesService.getAll().pipe(
      map((categories: ProductCategory[]) => {
        // Agregar categoría "Todos" al principio del array
        const allCategoriesOption = {
          label: 'Todos',
          id: 'ALL', // Usar un valor especial para indicar "todos los productos"
          command: () => {
            this.loading.setLoading({
              isLoading: true,
              text: 'Cargando...',
            });
            this.loadAllProducts().subscribe(() => {
              console.log('all loaded');

              this.loading.setLoading({ isLoading: false });
            });
          },
        };

        this.categories = [
          allCategoriesOption,
          ...categories
            .filter((c) => c.active)
            .map((category) => ({
              label: category.name,
              id: category.id.toString(),
              command: () => {
                this.loading.setLoading({
                  isLoading: true,
                  text: 'Cargando...',
                });
                this.loadProducts(category.id).subscribe(() => {
                  this.loading.setLoading({ isLoading: false });
                });
              },
            })),
        ];
      })
    );
  }

  public ngOnInit(): void {
    this.loading.setLoading({ isLoading: true, text: 'Cargando...' });
    this.loadCategories().subscribe(() => {
      this.loadAllProducts().subscribe(() => {
        this.loading.setLoading({ isLoading: false });
      });
    });
    this.filters = [
      {
        label: 'Orden',
        items: [
          {
            label: 'Nombre A-Z',
            command: this.sortByNameAZ.bind(this),
          },

          {
            label: 'Nombre Z-A',
            command: this.sortByNameZA.bind(this),
          },
          {
            label: 'Menor precio',
            command: this.sortByPriceMenor.bind(this),
          },
          {
            label: 'Mayor precio',
            command: this.sortByPriceMayor.bind(this),
          },
        ],
      },
    ];
  }
}
