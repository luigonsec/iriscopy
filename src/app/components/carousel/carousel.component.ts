import { Component, Input } from '@angular/core';
import Banner from 'src/app/interfaces/Banner';
import { BannersService } from 'src/app/services/banners.service';

interface Slide {
  imageUrl: string;
  caption: string;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  @Input('seconds_per_slide') seconds_per_slide = 10;

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
  banner_index = 0;
  banner_counter = 0;

  constructor(private bannersService: BannersService) { }




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

  setBannerInterval() {
    setInterval(() => {
      this.banner_index = this.banner_counter % this.banners.length;
      this.banner_counter++;
    }, this.seconds_per_slide * 1000);
  }

  ngOnInit(): void {
    this.setBannerInterval();
    this.loadBanners();
  }
}
