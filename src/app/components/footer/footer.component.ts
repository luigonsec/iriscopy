import { Component } from '@angular/core';
import locations from 'src/config/locations';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public locations = locations;
}
