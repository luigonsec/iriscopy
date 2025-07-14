import { Component, ElementRef, ViewChild } from '@angular/core';
import { ShopcartService } from './services/shopcart.service';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  @ViewChild('header', { static: false, read: ElementRef })
  headerElement!: ElementRef;

  constructor(private shopCart: ShopcartService, private primeng: PrimeNG) {}

  ngOnInit(): void {
    this.primeng.theme.set({
      preset: Aura,
    });

    const cartIsValid = this.shopCart.validate();
    if (!cartIsValid) {
      this.shopCart.clearCart();
    }
  }

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
}
