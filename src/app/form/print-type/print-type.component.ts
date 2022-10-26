import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-print-type',
  templateUrl: './print-type.component.html',
  styleUrls: ['./print-type.component.scss'],
})
export class PrintTypeComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const printForm = $event.value;
    this.emitChange.emit(printForm);
  }

  ngOnInit(): void {
    const blancoNegro = { name: 'Blanco y negro', code: 'blanco-negro' };
    const color = { name: 'Color', code: 'color' };
    const eco = { name: 'Color ECO', code: 'color-eco' };
    this.options = [blancoNegro, color, eco];
    this.option = color;
    this.emitChange.emit(this.option);
  }
}
