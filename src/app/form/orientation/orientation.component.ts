import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';

@Component({
  selector: 'app-orientation',
  templateUrl: './orientation.component.html',
  styleUrls: ['./orientation.component.scss'],
})
export class OrientationComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  ngOnInit(): void {
    this.options = options.orientation;
    this.option = options.orientation.find((x) => x.default);
    this.emitChange.emit(this.option);
  }

  handleChange($event) {
    const orientation = $event.value;
    this.emitChange.emit(orientation);
  }
}
