import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-flyers-custom-size',
  templateUrl: './input-flyers-custom-size.component.html',
  styleUrls: ['./input-flyers-custom-size.component.scss'],
})
export class InputFlyersCustomSizeComponent implements OnInit {
  @Output() emitChange = new EventEmitter<{
    height: number;
    width: number;
  }>();

  public height = null;
  public width = null;

  constructor() {}

  handleChange($event) {
    const quantity = $event.value;
    this.emitChange.emit({
      height: this.height,
      width: this.width,
    });
  }

  ngOnInit(): void {
    this.emitChange.emit({
      height: this.height,
      width: this.width,
    });
  }
}
