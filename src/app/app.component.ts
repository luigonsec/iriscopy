import { Component } from '@angular/core';
import Loading from './interfaces/Loading';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  loading: Loading;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loading = this.loadingService.isLoading();
    this.loadingService.isLoading$().subscribe((payload: Loading) => {
      this.loading = payload;
    });
  }
}
