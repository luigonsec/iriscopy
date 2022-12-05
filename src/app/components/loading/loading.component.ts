import { Component, Input, OnInit } from '@angular/core';
import Loading from 'src/app/interfaces/Loading';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Input() private payload: Loading;
  text: string;

  constructor(private loadingService: LoadingService) {}
  ngOnInit(): void {
    this.text = this.payload.text;
    this.loadingService.isLoading$().subscribe((payload: Loading) => {
      this.text = payload.text;
    });
  }
}
