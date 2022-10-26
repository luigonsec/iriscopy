import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-paper-grammage',
  templateUrl: './paper-grammage.component.html',
  styleUrls: ['./paper-grammage.component.scss'],
})
export class PaperGrammageComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const paperGrammage = $event.value;
    this.emitChange.emit(paperGrammage);
  }
  ngOnInit(): void {
    const normal = { name: 'Normal', code: 'normal', factor: 0 };
    const cartulina = { name: 'Cartulina', code: 'cartulina', factor: 0.1 };
    const fotografico = {
      name: 'Fortográfico',
      code: 'fotografico',
      factor: 0.15,
    };

    this.options = [normal, cartulina, fotografico];
    this.option = normal;
    this.emitChange.emit(this.option);
  }
}
