import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import OrderProduct from 'src/app/interfaces/OrderProduct';
import { OrdersService } from 'src/app/services/orders.service';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, OnDestroy {
  public copies: OrderCopy[] = [];
  public products: OrderProduct[] = [];

  public copiesPrice = {};
  public copiesNotes = {};

  cartSubscription: Subscription;
  constructor(
    private router: Router,
    private orderService: OrdersService,
    private shopcartService: ShopcartService
  ) {}

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  getTotalPrice() {
    const priceCopies = this.copies
      .map((x) => this.copiesPrice[x.id])
      .reduce((a, b) => a + b, 0);

    const priceProducts = this.products
      .map((x) => this.getProductPrice(x))
      .reduce((a, b) => a + b, 0);

    return priceCopies + priceProducts;
  }

  getCopiesPrice() {
    this.copies.forEach((copy) => {
      this.getCopyPrice(copy);
    });
  }

  getCopyPrice(order: OrderCopy) {
    this.orderService
      .getCopyPrice(order, this.copies)
      .subscribe(({ precio, notas }) => {
        this.copiesPrice[order.id] = precio;
        this.copiesNotes[order.id] = notas;
        this.copiesPrice = Object.assign({}, this.copiesPrice);
        this.copiesNotes = Object.assign({}, this.copiesNotes);
      });
  }

  getProductPrice(order: OrderProduct): number {
    return parseFloat(order.product.price) * order.quantity;
  }

  removeCopy(order: OrderCopy): void {
    this.shopcartService.removeCopy(order);
  }

  editCopy(order: OrderCopy): void {
    this.orderService.setOrderToEdit(order);

    this.router.navigate(['/print']);
  }

  removeProduct(product: OrderProduct): void {
    this.shopcartService.removeProduct(product);
  }

  removeFile(order_id: string, files_id: number) {
    const orderIndex = this.copies.findIndex((order) => order.id === order_id);

    if (orderIndex !== -1) {
      const order = this.copies[orderIndex];
      const files = order.files;
      this.copies[orderIndex].files = files.filter(
        (file) => file.id !== files_id
      );

      if (this.copies[orderIndex].files.length === 0) {
        this.copies.splice(orderIndex, 1);
      }

      this.shopcartService.updateCopies(this.copies);
    }
  }

  ngOnInit(): void {
    this.copies = this.shopcartService.getCart().copies;
    this.products = this.shopcartService.getCart().products;
    this.getCopiesPrice();

    this.cartSubscription = this.shopcartService
      .getCart$()
      .subscribe((orders) => {
        this.copies = orders.copies;
        this.products = orders.products;
        this.getCopiesPrice();
      });
  }
}
