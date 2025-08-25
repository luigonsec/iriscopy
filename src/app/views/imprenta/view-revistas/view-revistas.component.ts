import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { SelectButtonComponent } from 'src/app/components/inputs/select-button/select-button.component';
import revistasOptions from 'src/config/revistas';
import Revista from '../../../interfaces/Revista';
import Option from '../../../interfaces/Option';
import { FormBase } from '../../../_classes/form-base.class';
import { PricesService } from '../../../services/prices.service';
import { ShopcartService } from '../../../services/shopcart.service';
import { FileValidatorFactory } from '../../../_helpers/file-validator';
import { MessageService } from 'primeng/api';
import File from '../../../interfaces/File';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-view-revistas',
  templateUrl: './view-revistas.component.html',
  styleUrls: ['./view-revistas.component.scss'],
  standalone: false,
})
export class ViewRevistasComponent
  extends FormBase<Revista>
  implements OnInit, AfterViewInit
{
  @ViewChild('uploader') public uploader: UploaderComponent;
  @ViewChild('coverPaperCategorySelector')
  public coverPaperCategorySelector: SelectButtonComponent;
  @ViewChild('coverPaperTypeSelector')
  public coverPaperTypeSelector: SelectButtonComponent;
  @ViewChild('innerPaperCategorySelector')
  public innerPaperCategorySelector: SelectButtonComponent;
  @ViewChild('innerPaperTypeSelector')
  public innerPaperTypeSelector: SelectButtonComponent;
  @ViewChild('formatSelector') public formatSelector: SelectButtonComponent;
  @ViewChild('paperSizeSelector')
  public paperSizeSelector: SelectButtonComponent;

  public revistasOptions = revistasOptions;
  public coverPaperTypeOptions: Option[] = [];
  public innerPaperTypeOptions: Option[] = [];

  private detectedOrientationCode: string;
  private detectedPaperSize: Option;
  private tmpFile: File;

  private allowedPages = [8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52];

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService,
    public messageService: MessageService
  ) {
    super();
    this.setMessageService(messageService);

    this.setFileValidator(
      FileValidatorFactory.createMagazineValidator({
        vertical_size: revistasOptions.vertical_size,
        horizontal_size: revistasOptions.horizontal_size,
        square_size: revistasOptions.square_size,
      })
    );
  }

  /**
   * Maneja el cambio de categoría de papel de portada y filtra gramajes según páginas
   */
  onCoverPaperCategoryChange(category: Option): void {
    this.order.cover_paperCategory = category;

    this.coverPaperTypeOptions = this.getFilteredCoverPaperTypes(category);

    if (this.coverPaperTypeSelector) {
      this.coverPaperTypeSelector.updateOptions(this.coverPaperTypeOptions);
    }

    this.order.cover_paperType = this.coverPaperTypeOptions[0];
    this.updateReady();
  }

  /**
   * Maneja el cambio de categoría de papel interior y filtra gramajes según páginas
   */
  onInnerPaperCategoryChange(category: Option): void {
    this.order.inner_paperCategory = category;

    this.innerPaperTypeOptions = this.getFilteredInnerPaperTypes(category);

    if (this.innerPaperTypeSelector) {
      this.innerPaperTypeSelector.updateOptions(this.innerPaperTypeOptions);
    }

    this.order.inner_paperType = this.innerPaperTypeOptions[0];
    this.updateReady();
  }

  /**
   * Filtra gramajes permitidos según el número de páginas del PDF
   */
  private getFilteredPaperTypes(allTypes: Option[], pages: number): Option[] {
    return allTypes.filter((type: Option) =>
      this.isGramajeAllowed(type.code, pages)
    );
  }

  private getFilteredCoverPaperTypes(category: Option): Option[] {
    const allTypes = this.revistasOptions.cover_paperType[category.code] || [];
    const pages = this.tmpFile?.pages || 0;
    return this.getFilteredPaperTypes(allTypes, pages);
  }

  private getFilteredInnerPaperTypes(category: Option): Option[] {
    const allTypes = this.revistasOptions.inner_paperType[category.code] || [];
    const pages = this.tmpFile?.pages || 0;
    return this.getFilteredPaperTypes(allTypes, pages);
  }

  private isGramajeAllowed(code: string, pages: number): boolean {
    if (!pages) return true;

    const weight = this.getWeightFromCode(code);
    if (!weight) return true;

    if (weight === 250) {
      const allowed = pages <= 8;

      return allowed;
    }

    if (weight === 200) {
      const allowed = pages <= 12;

      return allowed;
    }

    if (weight === 150) {
      const allowed = pages <= 36;

      return allowed;
    }

    if (weight === 115 || weight === 130) {
      const allowed = pages <= 52;

      return allowed;
    }

    return false;
  }

  /**
   * Obtiene el peso de un gramaje por su código
   */
  private getWeightFromCode(code: string): number | undefined {
    const coverTypes = Object.values(this.revistasOptions.cover_paperType);
    const innerTypes = Object.values(this.revistasOptions.inner_paperType);

    const allTypes: Option[] = [];
    coverTypes.forEach((types) => allTypes.push(...types));
    innerTypes.forEach((types) => allTypes.push(...types));

    const type = allTypes.find((t) => t.code === code);
    return type?.weight;
  }

  /**
   * Detecta orientación y tamaño del PDF subido y preselecciona formato y tamaño
   */
  protected setDetectedOrientation(orientation: string): void {
    this.detectedOrientationCode = orientation;
    const formatOption = this.revistasOptions.format.find(
      (option) => option.code === orientation
    );
    if (formatOption) {
      this.order.format = formatOption;
      this.order = Object.assign({}, this.order);
      if (this.formatSelector) {
        this.formatSelector.setUpOption(formatOption);
        this.formatSelector.disable();
      }
      setTimeout(() => {
        this.applyPaperSizeIfDetected();
      }, 0);
    }
  }

  protected setDetectedSize(paperSize: Option): void {
    this.detectedPaperSize = paperSize;
    this.applyPaperSizeIfDetected();
  }

  private applyPaperSizeIfDetected(): void {
    if (this.detectedPaperSize && this.paperSizeSelector) {
      this.order.paperSize = this.detectedPaperSize;
      this.order = Object.assign({}, this.order);
      this.paperSizeSelector.setUpOption(this.detectedPaperSize);
      this.paperSizeSelector.disable();
    }
  }

  /**
   * Restaura la configuración cuando se elimina un archivo
   */
  public undoPresetProperties(): void {
    this.detectedOrientationCode = undefined;
    this.detectedPaperSize = undefined;
    if (this.formatSelector) {
      this.formatSelector.enable();
    }
    if (this.paperSizeSelector) {
      this.paperSizeSelector.enable();
    }

    this.restoreOriginalPaperTypeOptions();
  }

  public presetProperties(file: File) {
    const pages = file.pages;

    this.tmpFile = { ...file };

    if (!this.allowedPages.includes(pages)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Páginas no válidas',
        detail: `Las revistas deben tener ${this.allowedPages.join(
          ', '
        )} páginas. Su archivo tiene ${pages} páginas.`,
      });
      return;
    }

    this.updatePaperTypeOptionsBasedOnPages(pages);
    super.presetProperties(file);
  }

  /**
   * Actualiza las opciones de gramaje basándose en el número de páginas
   */
  private updatePaperTypeOptionsBasedOnPages(pages: number): void {
    if (this.order.cover_paperCategory) {
      this.coverPaperTypeOptions = this.getFilteredCoverPaperTypes(
        this.order.cover_paperCategory
      );

      if (this.coverPaperTypeSelector) {
        this.coverPaperTypeSelector.updateOptions(this.coverPaperTypeOptions);
      }

      if (
        !this.order.cover_paperType ||
        !this.coverPaperTypeOptions.find(
          (opt) => opt.code === this.order.cover_paperType?.code
        )
      ) {
        this.order.cover_paperType = this.coverPaperTypeOptions[0];
      }
    }

    if (this.order.inner_paperCategory) {
      this.innerPaperTypeOptions = this.getFilteredInnerPaperTypes(
        this.order.inner_paperCategory
      );

      if (this.innerPaperTypeSelector) {
        this.innerPaperTypeSelector.updateOptions(this.innerPaperTypeOptions);
      }

      if (
        !this.order.inner_paperType ||
        !this.innerPaperTypeOptions.find(
          (opt) => opt.code === this.order.inner_paperType?.code
        )
      ) {
        this.order.inner_paperType = this.innerPaperTypeOptions[0];
      }
    }
  }

  /**
   * Restaura las opciones originales de gramaje cuando se elimina el archivo
   */
  private restoreOriginalPaperTypeOptions(): void {
    if (this.order.cover_paperCategory) {
      this.coverPaperTypeOptions =
        this.revistasOptions.cover_paperType[
          this.order.cover_paperCategory.code
        ] || [];

      if (this.coverPaperTypeSelector) {
        this.coverPaperTypeSelector.updateOptions(this.coverPaperTypeOptions);
      }
    }

    if (this.order.inner_paperCategory) {
      this.innerPaperTypeOptions =
        this.revistasOptions.inner_paperType[
          this.order.inner_paperCategory.code
        ] || [];

      if (this.innerPaperTypeSelector) {
        this.innerPaperTypeSelector.updateOptions(this.innerPaperTypeOptions);
      }
    }
  }

  updateReady() {
    let res = true;
    if (!this.order.cover_paperCategory) res = false;
    if (!this.order.inner_paperCategory) res = false;
    if (!this.order.cover_paperType) res = false;
    if (!this.order.inner_paperType) res = false;
    if (!this.order.paperSize) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;
    this.ready = res;
  }

  getPrice = async () => {
    return await firstValueFrom(
      this.pricesService.getMagazinePrice(this.order)
    );
  };

  addToCartFn = async (order: Revista) => {
    this.shopCart.addMagazineToCart.bind(this.shopCart)(order);
    return this.reset();
  };

  public reset() {
    // Obtener valores por defecto
    const defaultFormat = this.revistasOptions.format.find(
      (option) => option.default
    );
    const defaultFinishType = this.revistasOptions.finishType.find(
      (option) => option.default
    );
    const defaultCoverCategory = this.revistasOptions.cover_paperCategory.find(
      (option) => option.default
    );
    const defaultInnerCategory = this.revistasOptions.inner_paperCategory.find(
      (option) => option.default
    );
    const defaultCopiesQuantity = this.revistasOptions.copiesQuantity.find(
      (option) => option.default
    );

    // Obtener tamaño por defecto basado en el formato por defecto
    let defaultPaperSize;
    if (defaultFormat) {
      if (defaultFormat.code === 'vertical') {
        defaultPaperSize = this.revistasOptions.vertical_size.find(
          (option) => option.default
        );
      } else if (defaultFormat.code === 'horizontal') {
        defaultPaperSize = this.revistasOptions.horizontal_size.find(
          (option) => option.default
        );
      } else if (defaultFormat.code === 'cuadrado') {
        defaultPaperSize = this.revistasOptions.square_size.find(
          (option) => option.default
        );
      }
    }

    // Inicializar las opciones de papel disponibles con las categorías por defecto
    if (defaultCoverCategory) {
      this.coverPaperTypeOptions =
        this.revistasOptions.cover_paperType[defaultCoverCategory.code] || [];
    }

    if (defaultInnerCategory) {
      this.innerPaperTypeOptions =
        this.revistasOptions.inner_paperType[defaultInnerCategory.code] || [];
    }

    // Obtener los tipos de papel por defecto para las categorías seleccionadas
    const defaultCoverPaperType = this.coverPaperTypeOptions.find(
      (option) => option.default
    );
    const defaultInnerPaperType = this.innerPaperTypeOptions.find(
      (option) => option.default
    );

    this.order = {
      format: defaultFormat,
      finishType: defaultFinishType,
      cover_paperCategory: defaultCoverCategory,
      cover_paperType: defaultCoverPaperType,
      inner_paperCategory: defaultInnerCategory,
      inner_paperType: defaultInnerPaperType,
      paperSize: defaultPaperSize,
      copiesQuantity: defaultCopiesQuantity?.code
        ? parseInt(defaultCopiesQuantity.code)
        : 0,
      additionalComments: '',
      files: [],
    };

    // Limpiar estado temporal
    this.tmpFile = undefined;
    this.detectedOrientationCode = undefined;
    this.detectedPaperSize = undefined;

    this.undoPresetProperties();
    this.updateReady();
  }

  ngOnInit() {
    this.reset();

    super.ngOnInit();
  }

  ngAfterViewInit() {
    if (this.detectedOrientationCode && this.formatSelector) {
      const formatOption = this.revistasOptions.format.find(
        (option) => option.code === this.detectedOrientationCode
      );
      if (formatOption) {
        this.formatSelector.setUpOption(formatOption);
        this.formatSelector.disable();
      }
    }

    this.applyPaperSizeIfDetected();

    if (this.order.files?.[0]?.pages) {
      this.updatePaperTypeOptionsBasedOnPages(this.order.files[0].pages);
    }
  }
}
