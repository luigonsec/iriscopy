import { Component, ElementRef, ViewChild } from '@angular/core';
import { ShopcartService } from './services/shopcart.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  @ViewChild('header', { static: false, read: ElementRef }) headerElement!: ElementRef;

  constructor(private shopCart: ShopcartService) { }

  ngAfterViewInit() {
    this.setHeaderHeight();
  }

  setHeaderHeight() {
    const headerHeight = this.headerElement.nativeElement.offsetHeight;
    document.documentElement.style.setProperty(
      '--header-height',
      `${headerHeight}px`
    );
  }



  ngOnInit(): void {
    const cartIsValid = this.shopCart.validate();
    if (!cartIsValid) {
      this.shopCart.clearCart();
    }
  }
}
