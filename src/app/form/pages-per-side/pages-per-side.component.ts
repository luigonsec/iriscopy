import { Component, OnInit } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-pages-per-side',
  templateUrl: './pages-per-side.component.html',
  styleUrls: ['./pages-per-side.component.scss'],
})
export class PagesPerSideComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;

  constructor() {
    this.options = [
      { name: '1 página', code: '1' },
      { name: '2 páginas', code: '2' },
      { name: '4 páginas', code: '4' },
    ];
  }

  ngOnInit(): void {}
}
