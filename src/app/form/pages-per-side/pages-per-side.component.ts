import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-pages-per-side',
  templateUrl: './pages-per-side.component.html',
  styleUrls: ['./pages-per-side.component.scss'],
})
export class PagesPerSideComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const pagesPerSide = $event.value;
    this.emitChange.emit(pagesPerSide);
  }

  ngOnInit(): void {
    const una = { name: '1 página', code: '1', description: 'Por cara' };
    const dos = { name: '2 páginas', code: '2', description: 'Por cara' };
    const cuatro = { name: '4 páginas', code: '4', description: 'Por cara' };
    this.options = [una, dos, cuatro];
    this.option = una;
    this.emitChange.emit(this.option);
  }
}
