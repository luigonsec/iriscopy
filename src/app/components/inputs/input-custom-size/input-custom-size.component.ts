import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-input-custom-size',
    templateUrl: './input-custom-size.component.html',
    styleUrls: ['./input-custom-size.component.scss'],
    standalone: false
})
export class InputCustomSizeComponent implements OnInit {
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
