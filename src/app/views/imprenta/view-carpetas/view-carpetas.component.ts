import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import Carpeta from '../../../interfaces/Carpeta';
import Option from '../../../interfaces/Option';
import folderOptions from 'src/config/carpetas';
import { FormBase } from '../../../_classes/form-base.class';
import { firstValueFrom } from 'rxjs';
import { PricesService } from '../../../services/prices.service';
import { ShopcartService } from '../../../services/shopcart.service';
import { FileValidatorFactory } from '../../../_helpers/file-validator';
import { MessageService } from 'primeng/api';
import { SelectButtonComponent } from '../../../components/inputs/select-button/select-button.component';

@Component({
  selector: 'app-view-carpetas',
  templateUrl: './view-carpetas.component.html',
  styleUrls: ['./view-carpetas.component.scss'],
  standalone: false,
})
export class ViewCarpetasComponent extends FormBase<Carpeta> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  @ViewChild('printFormSelector')
  public printFormSelector: SelectButtonComponent;
  @ViewChild('paperSizeSelector')
  public paperSizeSelector: SelectButtonComponent;
  @ViewChild('paperCategorySelector')
  public paperCategorySelector: SelectButtonComponent;
  @ViewChild('paperTypeSelector')
  public paperTypeSelector: SelectButtonComponent;

  public folderOptions = folderOptions;
  public paperTypeOptions: Option[] = [];

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService,
    public messageService: MessageService
  ) {
    super();

    // Configurar el validador y el servicio de mensajes
    this.setFileValidator(
      FileValidatorFactory.createCarpetaValidator(folderOptions)
    );
    this.setMessageService(messageService);
  }

  /**
   * Maneja el cambio de categoría de papel y actualiza las opciones disponibles
   */
  onPaperCategoryChange(category: any) {
    if (category && category.code) {
      this.paperTypeOptions = this.folderOptions.paperType[category.code] || [];
      // Actualizar las opciones del selector de tipo de papel
      if (this.paperTypeSelector) {
        this.paperTypeSelector.updateOptions(this.paperTypeOptions);
      }
      // Resetear la selección de tipo de papel
      this.order.paperType = this.paperTypeOptions[0];
    }
    this.updateReady();
  }

  updateReady() {
    let res = true;

    if (!this.order.printForm) res = false;
    if (!this.order.paperCategory) res = false;
    if (!this.order.paperType) res = false;
    if (!this.order.finishType) res = false;
    if (!this.order.paperSize) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    this.ready = res;
  }

  getPrice = async () => {
    return await firstValueFrom(this.pricesService.getFolderPrice(this.order));
  };

  addToCartFn = async (order: Carpeta) => {
    return this.shopCart.addFolderToCart.bind(this.shopCart)(order);
  };

  /**
   * Configura automáticamente el printForm basado en el número de páginas
   */
  protected setRecommendedPrintForm(printFormCode: string): void {
    const printFormOption = this.folderOptions.printForm.find(
      (option) => option.code === printFormCode
    );

    if (printFormOption && this.printFormSelector) {
      this.printFormSelector.setUpOption(printFormOption);
      this.printFormSelector.disable();
    }
  }

  /**
   * Configura automáticamente el tamaño del papel basado en las dimensiones del archivo
   */
  protected setDetectedSize(paperSize: any): void {
    if (this.paperSizeSelector) {
      this.paperSizeSelector.setUpOption(paperSize);
      this.paperSizeSelector.disable();
    }
  }

  /**
   * Restaura la configuración cuando se elimina un archivo
   */
  public undoPresetProperties(): void {
    if (this.printFormSelector) {
      this.printFormSelector.enable();
    }
    if (this.paperSizeSelector) {
      this.paperSizeSelector.enable();
    }
    if (this.paperCategorySelector) {
      this.paperCategorySelector.enable();
    }
    if (this.paperTypeSelector) {
      this.paperTypeSelector.enable();
    }
  }

  ngOnInit() {
    this.order = {
      printForm: undefined,
      paperCategory: undefined,
      paperType: undefined,
      finishType: undefined,
      paperSize: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };

    // Inicializar las opciones de papel disponibles con la categoría por defecto
    const defaultCategory = this.folderOptions.paperCategory.find(
      (cat) => cat.default
    );
    if (defaultCategory) {
      this.paperTypeOptions =
        this.folderOptions.paperType[defaultCategory.code] || [];
    }

    super.ngOnInit();
  }
}
