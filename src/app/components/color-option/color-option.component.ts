import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-color-option',
  templateUrl: './color-option.component.html',
  styleUrls: ['./color-option.component.scss'],
})
export class ColorOptionComponent implements OnInit {
  @Input() public option: { color: string; name: string };
  constructor() {}

  ngOnInit(): void {}

  colorClicked($event) {
    console.log($event, this.option);
  }
}
