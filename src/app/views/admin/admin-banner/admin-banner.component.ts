import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import Banner from 'src/app/interfaces/Banner';
import { BannersService } from 'src/app/services/banners.service';

@Component({
  selector: 'app-admin-banner',
  templateUrl: './admin-banner.component.html',
  styleUrls: ['./admin-banner.component.scss'],
})
export class AdminBannerComponent implements OnInit {
  banners: Banner[];
  banner: Banner = {
    url: undefined,
    visible_pc: false,
    visible_phone: false,
    visible_shop: false,
    visible_print: false,
    link_to: undefined,
  };
  constructor(
    private messageService: MessageService,
    private bannerService: BannersService,
    private confirm: ConfirmationService
  ) {
    this.clear();
  }

  clear() {
    this.banner = {
      url: undefined,
      visible_pc: false,
      visible_phone: false,
      visible_shop: false,
      visible_print: false,
    };
  }

  ngOnInit(): void {
    this.loadBanners();
  }

  confirmCreate() {
    this.confirm.confirm({
      header: 'Añadir nuevo banner',
      message: '¿Estás seguro/a que desea añadir el banner?',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.performCreate();
      },
    });
  }

  confirmDelete(id: number) {
    this.confirm.confirm({
      header: 'Eliminar banner',
      message: '¿Estás seguro/a que desea eliminar el banner?',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.performDelete(id);
      },
    });
  }

  confirmUpdate(banner: Banner) {
    this.confirm.confirm({
      header: 'Actualizar banner',
      message: '¿Estás seguro/a de guardar los cambios en el banner?',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.performUpdate(banner);
      },
    });
  }

  performCreate() {
    this.bannerService.create(this.banner).subscribe(
      () => {
        this.clear();
        this.messageService.add({
          summary: 'Banner creado',
          detail: 'El banner ha sido creado con éxito',
          severity: 'success',
        });
        this.loadBanners();
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ha ocurrido un error',
        });
      }
    );
  }

  performDelete(id: number) {
    this.bannerService.delete(id).subscribe(
      () => {
        this.messageService.add({
          summary: 'Banner eliminado',
          detail: 'El banner ha sido eliminado con éxito',
          severity: 'success',
        });
        this.loadBanners();
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ha ocurrido un error',
        });
      }
    );
  }

  performUpdate(banner: Banner) {
    this.bannerService.update(banner).subscribe(
      () => {
        this.messageService.add({
          summary: 'Banner actualizado',
          detail: 'El banner ha sido actualizado con éxito',
          severity: 'success',
        });
        this.loadBanners();
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ha ocurrido un error',
        });
      }
    );
  }

  loadBanners() {
    this.bannerService.getAll().subscribe((banners: Banner[]) => {
      this.banners = banners;
    });
  }
}
