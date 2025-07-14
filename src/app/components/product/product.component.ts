import { Component, Input, OnInit } from '@angular/core';
import Product from 'src/app/interfaces/Product';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    providers: [DialogService],
    standalone: false
})
export class ProductComponent {
  @Input('product') product: Product;
  public quantity: number = 0;
  ref: DynamicDialogRef | undefined;
}
