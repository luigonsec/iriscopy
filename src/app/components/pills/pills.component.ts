import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-pills',
  templateUrl: './pills.component.html',
  styleUrls: ['./pills.component.scss'],
})
export class PillsComponent implements OnInit {
  @Input('pills')
  pills: MenuItem[] = [];

  activePill(item: MenuItem) {
    this.pills.forEach((pill) => {
      pill.styleClass = undefined;
    });
    item.styleClass = 'active';
    item.command();
  }

  ngOnInit() {
    console.log(this.pills);
  }
}
