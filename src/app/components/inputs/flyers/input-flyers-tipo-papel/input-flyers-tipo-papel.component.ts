import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/flyers';

@Component({
  selector: 'app-input-flyers-tipo-papel',
  templateUrl: './input-flyers-tipo-papel.component.html',
  styleUrls: ['./input-flyers-tipo-papel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InputFlyersTipoPapelComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  public groups: string[] = [];
  public optionsByGroup: { [key: string]: Option[] } = {};

  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const paperType = $event.value;
    this.emitChange.emit(paperType);
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
