import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-shopcart-print-item',
  templateUrl: './shopcart-print-item.component.html',
  styleUrls: ['./shopcart-print-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShopcartPrintItemComponent {
  @Input('name') name: string;
  @Input('item') item: any;
  @Input('removeFn') removeFn: (item: any) => void;
  @Input('price') price: number;
}
