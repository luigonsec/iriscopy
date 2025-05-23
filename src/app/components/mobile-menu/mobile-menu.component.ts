import { Component } from '@angular/core';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent {
  pickUpPointsOpened = false;

  public togglePickUpPoints() {
    this.pickUpPointsOpened = !!!this.pickUpPointsOpened;
  }
}
