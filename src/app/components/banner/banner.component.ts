import { Component, Input, OnInit } from '@angular/core';
import Banner from 'src/app/interfaces/Banner';
import { BannersService } from 'src/app/services/banners.service';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
    standalone: false
})
export class BannerComponent implements OnInit {
  @Input('options')
  options: {
    visible_pc: boolean;
    visible_phone: boolean;
    visible_shop: boolean;
    visible_print: boolean;
  } = {
    visible_pc: false,
    visible_phone: false,
    visible_shop: false,
    visible_print: false,
  };
  banners: Banner[] = [];
  constructor(private bannersService: BannersService) {}

  loadBanners() {
    this.bannersService.getAll().subscribe((banners: Banner[]) => {
      this.banners = banners.filter((banner) => {
        const visible_screen =
          (banner.visible_pc && banner.visible_pc == this.options.visible_pc) ||
          (banner.visible_phone &&
            banner.visible_phone == this.options.visible_phone);

        const visible_view =
          (banner.visible_shop &&
            banner.visible_shop == this.options.visible_shop) ||
          (banner.visible_print &&
            banner.visible_print == this.options.visible_print);
        return visible_screen && visible_view;
      });
    });
  }

  ngOnInit(): void {
    this.loadBanners();
  }
}
