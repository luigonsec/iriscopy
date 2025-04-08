import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/flyers';

@Component({
  selector: 'app-input-flyers-size',
  templateUrl: './input-flyers-size.component.html',
  styleUrls: ['./input-flyers-size.component.scss'],
})
export class InputFlyersSizeComponent implements OnInit {
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
    this.options = options.size;
    this.option = options.size.find((x) => x.default);
    this.groups = [...new Set(this.options.map((x) => x.group))];
    this.groups.forEach((group) => {
      this.optionsByGroup[group] = this.options.filter(
        (x) => x.group === group
      );
    });
    this.emitChange.emit(this.option);
  }
}
