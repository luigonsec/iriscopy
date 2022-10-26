import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';

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
    this.options = options.paperType;
    this.option = options.paperType.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}
