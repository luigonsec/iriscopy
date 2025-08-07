import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { SelectButtonComponent } from 'src/app/components/inputs/select-button/select-button.component';
import revistasOptions from 'src/config/revistas';
import Revista from '../../../interfaces/Revista';
import Option from '../../../interfaces/Option';
import { FormBase } from '../../../_classes/form-base.class';
import { PricesService } from '../../../services/prices.service';
import { ShopcartService } from '../../../services/shopcart.service';
@Component({
  selector: 'app-view-revistas',
  templateUrl: './view-revistas.component.html',
  styleUrls: ['./view-revistas.component.scss'],
  standalone: false,
})
export class ViewRevistasComponent extends FormBase<Revista> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  @ViewChild('coverPaperCategorySelector')
  public coverPaperCategorySelector: SelectButtonComponent;
  @ViewChild('coverPaperTypeSelector')
  public coverPaperTypeSelector: SelectButtonComponent;
  @ViewChild('innerPaperCategorySelector')
  public innerPaperCategorySelector: SelectButtonComponent;
  @ViewChild('innerPaperTypeSelector')
  public innerPaperTypeSelector: SelectButtonComponent;

  public revistasOptions = revistasOptions;
  public coverPaperTypeOptions: Option[] = [];
  public innerPaperTypeOptions: Option[] = [];

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService
  ) {
    super();
  }

  isCustomSize() {
    const formatKey =
      this.order.format.code === 'cuadrado' ? 'square' : this.order.format.code;
    return this.order[`${formatKey}_size`]?.code === 'personalizado';
  }

  updateReady() {
    let res = true;

    if (!this.order.cover_paperCategory) res = false;
    if (!this.order.inner_paperCategory) res = false;
    if (!this.order.cover_paperType) res = false;
    if (!this.order.inner_paperType) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    this.ready = res;
  }

  /**
   * Maneja el cambio de categoría de papel de portada
   */
  onCoverPaperCategoryChange(category: any) {
    if (category && category.code) {
      this.coverPaperTypeOptions =
        this.revistasOptions.cover_paperType[category.code] || [];
      // Actualizar las opciones del selector de tipo de papel
      if (this.coverPaperTypeSelector) {
        this.coverPaperTypeSelector.updateOptions(this.coverPaperTypeOptions);
      }
      // Resetear la selección de tipo de papel
      this.order.cover_paperType = this.coverPaperTypeOptions[0];
    }
    this.updateReady();
  }

  /**
   * Maneja el cambio de categoría de papel interior
   */
  onInnerPaperCategoryChange(category: any) {
    if (category && category.code) {
      this.innerPaperTypeOptions =
        this.revistasOptions.inner_paperType[category.code] || [];
      // Actualizar las opciones del selector de tipo de papel
      if (this.innerPaperTypeSelector) {
        this.innerPaperTypeSelector.updateOptions(this.innerPaperTypeOptions);
      }
      // Resetear la selección de tipo de papel
      this.order.inner_paperType = this.innerPaperTypeOptions[0];
    }
    this.updateReady();
  }

  getPrice = async () => {
    return Promise.resolve({ precio: 55, notas: [] as string[] });
  };

  addToCartFn = async (order: Revista) => {
    return this.shopCart.addMagazineToCart.bind(this.shopCart)(order);
  };

  ngOnInit() {
    this.order = {
      format: undefined,
      vertical_size: undefined,
      horizontal_size: undefined,
      square_size: undefined,
      cover_paperCategory: undefined,
      inner_paperCategory: undefined,
      inner_paperType: undefined,
      cover_paperType: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };
    super.ngOnInit();
  }
}
