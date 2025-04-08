import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/tarjetas-visita';

@Component({
  selector: 'app-input-tarjetas-visita-tipo-papel',
  templateUrl: './input-tarjetas-visita-tipo-papel.component.html',
  styleUrls: ['./input-tarjetas-visita-tipo-papel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InputTarjetasVisitaTipoPapelComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  public groups: string[] = [];
  public optionsByGroup: { [key: string]: Option[] } = {};

  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const paperType = $event.value;
    this.emitChange.emit(paperType);
    console.log(paperType);
  }

  ngOnInit(): void {
    this.options = options.paperType;
    this.option = options.paperType.find((x) => x.default);
    this.groups = [...new Set(this.options.map((x) => x.group))];
    this.groups.forEach((group) => {
      this.optionsByGroup[group] = this.options.filter(
        (x) => x.group === group
      );
    });
    this.emitChange.emit(this.option);
  }
}
