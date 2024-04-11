import { Component, OnInit } from '@angular/core';
import Loading from 'src/app/interfaces/Loading';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  public payload: Loading = {
    isLoading: false,
    text: undefined,
  };

  constructor(private loadingService: LoadingService) {}
  ngOnInit(): void {
    this.loadingService.isLoading$().subscribe((payload: Loading) => {
      this.payload = payload;
    });
  }
}
