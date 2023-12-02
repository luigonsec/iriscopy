import { Component, OnInit } from '@angular/core';
import Banner from 'src/app/interfaces/Banner';
import { BannersService } from 'src/app/services/banners.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  banners: Banner[] = [];
  constructor(private bannersService: BannersService) {}

  loadBanners() {
    this.bannersService.getAll().subscribe((banners: Banner[]) => {
      this.banners = banners;
    });
  }

  ngOnInit(): void {
    this.loadBanners();
  }
}
