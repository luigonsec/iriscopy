import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent {
  constructor(private router: Router) {}

  pickUpPointsOpened = false;
  printOptionsOpened = false;

  public togglePickUpPoints() {
    this.pickUpPointsOpened = !!!this.pickUpPointsOpened;
  }

  public togglePrintOptions() {
    this.printOptionsOpened = !!!this.printOptionsOpened;
  }

  redirectTo(path: string) {
    // Cierra el menú móvil al redirigir
    this.printOptionsOpened = false;
    this.router.navigate([path]);
  }
}
