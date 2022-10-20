import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-color-option',
  templateUrl: './color-option.component.html',
  styleUrls: ['./color-option.component.scss'],
})
export class ColorOptionComponent implements OnInit {
  @Output() public eventEmitter = new EventEmitter<{
    color: string;
    name: string;
  }>();

  @Input() public active: boolean;
  @Input() public option: { color: string; name: string };

  constructor() {}

  ngOnInit(): void {}

  colorClicked() {
    this.eventEmitter.emit(this.option);
  }
}
