import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-bound-type',
  templateUrl: './bound-type.component.html',
  styleUrls: ['./bound-type.component.scss'],
})
export class BoundTypeComponent implements OnInit {
  public options: Option[];
  @Input() public option: Option;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const printForm = $event.value;
    this.emitChange.emit(printForm);
  }

  ngOnInit(): void {
    const individual = {
      name: 'Individualmente',
      code: 'individual',
      description: 'Por cada documento',
    };
    const agrupados = {
      name: 'Agrupados',
      code: 'agrupados',
      description: 'Todos en uno',
    };

    this.options = [individual, agrupados];
    this.option = this.option || individual;
    this.emitChange.emit(this.option);
  }
}
