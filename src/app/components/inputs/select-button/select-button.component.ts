import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-select-button',
  templateUrl: './select-button.component.html',
  styleUrls: ['./select-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectButtonComponent implements OnInit {
  @Input('options') public options: Option[];
  public option: Option = undefined;
  public groups: string[] = [];
  public optionsByGroup: { [key: string]: Option[] } = {};

  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const option = $event.value;
    this.emitChange.emit(option);
  }

  ngOnInit(): void {
    this.option = this.options.find((x) => x.default);
    this.groups = [...new Set(this.options.map((x) => x.group))];
    this.groups.forEach((group) => {
      this.optionsByGroup[group] = this.options.filter(
        (x) => x.group === group
      );
    });
    this.emitChange.emit(this.option);
  }
}
