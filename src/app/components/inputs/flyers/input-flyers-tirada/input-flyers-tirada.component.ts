import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/tarjetas-visita';

@Component({
  selector: 'app-input-flyers-tirada',
  templateUrl: './input-flyers-tirada.component.html',
  styleUrls: ['./input-flyers-tirada.component.scss'],
})
export class InputFlyersTiradaComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  public groups: string[] = [];
  public optionsByGroup: { [key: string]: Option[] } = {};
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const printForm = $event.value;
    this.emitChange.emit(printForm);
  }

  ngOnInit(): void {
    this.options = options.printQuantity;
    this.option = options.printQuantity.find((x) => x.default);
    this.groups = [...new Set(this.options.map((x) => x.group))];
    this.groups.forEach((group) => {
      this.optionsByGroup[group] = this.options.filter(
        (x) => x.group === group
      );
    });
    this.emitChange.emit(this.option);
  }
}
