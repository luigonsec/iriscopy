import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-quantity-copies',
  templateUrl: './quantity-copies.component.html',
  styleUrls: ['./quantity-copies.component.scss'],
})
export class QuantityCopiesComponent implements OnInit {
  @Output() emitChange = new EventEmitter<number>();

  public quantity = 1;

  constructor() {}

  handleChange($event) {
    const quantity = $event.value;
    this.emitChange.emit(quantity);
  }

  ngOnInit(): void {
    this.emitChange.emit(this.quantity);
  }
}
