import { Component } from '@angular/core';
import Option from './interfaces/Option';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public finishType: Option;
  title = 'iriscopy';

  getFinishType(value) {
    this.finishType = value;
  }
}
