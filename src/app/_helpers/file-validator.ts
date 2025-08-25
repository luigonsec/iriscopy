import File, { PageDimensions } from '../interfaces/File';

// Constantes para sangría
const BLEED_MARGIN = 3; // 3mm por cada lado
const TOTAL_BLEED = BLEED_MARGIN * 2; // 6mm total (3mm por cada lado)

// Enums para los tipos de validación
export enum ProductType {
  FLYERS = 'flyers',
  CARPETAS = 'carpetas',
  DIPTICOS = 'dipticos',
  TRIPTICOS = 'tripticos',
  TARJETAS_VISITA = 'tarjetas-visita',
  ROLL_UPS = 'rollups',
  REVISTAS = 'revistas',
}

export enum OrientationType {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  CUADRADO = 'cuadrado',
}

// Interfaces para la configuración de validación
export interface PaperSizeOption {
  code: string;
  name: string;
  width: number;
  height: number;
  description?: string;
}

export interface PrintFormOption {
  code: string;
  name: string;
  description?: string;
}

export interface ValidationConfig {
  productType: ProductType;
  allowedPages: number[];
  paperSizes?: PaperSizeOption[];
  orientationSizes?: {
    vertical?: PaperSizeOption[];
    horizontal?: PaperSizeOption[];
    cuadrado?: PaperSizeOption[];
  };
  printFormMapping?: {
    onePage: string;
    twoPages: string;
  };
  requiresBleed?: boolean; // Si requiere sangría
  isOpenSize?: boolean; // Si las dimensiones son del tamaño abierto (flyers/trípticos)
}

// Interfaces para los resultados de validación
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  detectedOrientation?: OrientationType;
  matchedSize?: PaperSizeOption;
  recommendedPrintForm?: string;
}

export interface ValidationError {
  type: 'pages' | 'dimensions' | 'orientation';
  message: string;
  expected?: any;
  actual?: any;
}

export class FileValidator {
  private config: ValidationConfig;

  constructor(config: ValidationConfig) {
    this.config = config;
  }

  /**
   * Valida un archivo según la configuración del producto
   */
  public validateFile(file: File): ValidationResult {
    const errors: ValidationError[] = [];
    let detectedOrientation: OrientationType | undefined;
    let matchedSize: PaperSizeOption | undefined;
    let recommendedPrintForm: string | undefined;

    // Validar número de páginas
    if (!this.isValidPageCount(file.pages)) {
      errors.push({
        type: 'pages',
        message: this.getPageCountErrorMessage(),
        expected: this.config.allowedPages.join(' o '),
        actual: file.pages,
      });
    }

    // Si hay dimensiones de página, validar las dimensiones
    if (file.pageDimensions && file.pageDimensions.length > 0) {
      const dimensionValidation = this.validateDimensions(file.pageDimensions);

      if (!dimensionValidation.isValid) {
        errors.push(...dimensionValidation.errors);
      } else {
        detectedOrientation = dimensionValidation.detectedOrientation;
        matchedSize = dimensionValidation.matchedSize;
      }
    }

    // Determinar printForm recomendado si hay mapeo configurado
    if (this.config.printFormMapping && this.isValidPageCount(file.pages)) {
      recommendedPrintForm =
        file.pages === 1
          ? this.config.printFormMapping.onePage
          : this.config.printFormMapping.twoPages;
    }

    return {
      isValid: errors.length === 0,
      errors,
      detectedOrientation,
      matchedSize,
      recommendedPrintForm,
    };
  }

  /**
   * Detecta la orientación basándose en las dimensiones
   */
  private detectOrientation(dimensions: PageDimensions): OrientationType {
    const { width, height } = dimensions;

    if (width === height) {
      return OrientationType.CUADRADO;
    } else if (height > width) {
      return OrientationType.VERTICAL;
    } else {
      return OrientationType.HORIZONTAL;
    }
  }

  /**
   * Calcula las dimensiones esperadas con sangría
   * @param originalWidth Ancho original del tamaño de papel
   * @param originalHeight Alto original del tamaño de papel
   * @returns Dimensiones con sangría aplicada
   */
  private calculateDimensionsWithBleed(
    originalWidth: number,
    originalHeight: number
  ): PageDimensions {
    return {
      width: originalWidth + TOTAL_BLEED,
      height: originalHeight + TOTAL_BLEED,
    };
  }

  /**
   * Calcula las dimensiones del tamaño abierto para productos plegables
   * @param closedWidth Ancho cerrado
   * @param closedHeight Alto cerrado
   * @param productType Tipo de producto (para determinar el factor de multiplicación)
   * @returns Dimensiones del tamaño abierto
   */
  private calculateOpenSize(
    closedWidth: number,
    closedHeight: number,
    productType?: ProductType
  ): PageDimensions {
    // Factor de multiplicación según el tipo de producto
    let multiplier = 2; // Por defecto para dípticos
    if (productType === ProductType.TRIPTICOS) {
      multiplier = 3; // Los trípticos se pliegan en 3 partes
    }

    return { width: closedWidth * multiplier, height: closedHeight };
  }

  /**
   * Obtiene las dimensiones finales esperadas considerando sangría y tamaño abierto
   * @param paperSize Tamaño del papel configurado
   * @param orientation Orientación (para productos plegables)
   * @returns Dimensiones finales esperadas del archivo
   */
  private getExpectedFileDimensions(
    paperSize: PaperSizeOption,
    orientation?: OrientationType
  ): PageDimensions {
    let expectedDimensions = {
      width: paperSize.width,
      height: paperSize.height,
    };

    // Si es un producto con tamaño abierto (dípticos/trípticos), calcular el tamaño abierto primero
    if (this.config.isOpenSize && orientation) {
      expectedDimensions = this.calculateOpenSize(
        expectedDimensions.width,
        expectedDimensions.height,
        this.config.productType
      );
    }

    // Si requiere sangría, añadirla al resultado final
    if (this.config.requiresBleed) {
      expectedDimensions = this.calculateDimensionsWithBleed(
        expectedDimensions.width,
        expectedDimensions.height
      );
    }

    return expectedDimensions;
  }

  /**
   * Valida las dimensiones del archivo
   */
  private validateDimensions(pageDimensions: PageDimensions[]): {
    isValid: boolean;
    errors: ValidationError[];
    detectedOrientation?: OrientationType;
    matchedSize?: PaperSizeOption;
  } {
    const errors: ValidationError[] = [];

    // Usar las dimensiones de la primera página para detectar orientación y tamaño
    const firstPageDimensions = pageDimensions[0];
    let detectedOrientation: OrientationType | undefined;
    let matchedSize: PaperSizeOption | undefined;

    // Si tenemos configuración de orientación (dípticos/trípticos)
    if (this.config.orientationSizes) {
      // Para productos plegables, necesitamos buscar en todas las orientaciones
      // ya que un díptico "vertical" se convierte en archivo "horizontal" cuando se abre
      if (this.config.isOpenSize) {
        // Buscar en todas las orientaciones posibles
        for (const [orientation, sizes] of Object.entries(
          this.config.orientationSizes
        )) {
          const orientationType = orientation as OrientationType;
          const foundSize = this.findMatchingSize(
            firstPageDimensions,
            sizes,
            orientationType
          );

          if (foundSize) {
            detectedOrientation = orientationType;
            matchedSize = foundSize;
            break;
          }
        }
      } else {
        // Para productos no plegables, usar la detección de orientación tradicional
        detectedOrientation = this.detectOrientation(firstPageDimensions);
        const sizesForOrientation =
          this.config.orientationSizes[detectedOrientation];

        if (sizesForOrientation) {
          matchedSize = this.findMatchingSize(
            firstPageDimensions,
            sizesForOrientation,
            detectedOrientation
          );
        }
      }

      if (!matchedSize) {
        errors.push({
          type: 'dimensions',
          message: `No se encontró un tamaño válido para las dimensiones del archivo`,
          expected: this.getAvailableSizesMessage(),
          actual: `${firstPageDimensions.width}x${firstPageDimensions.height}mm`,
        });
      }
    }
    // Si tenemos configuración de tamaños directa (flyers/carpetas)
    else if (this.config.paperSizes) {
      // Para productos con tamaño abierto, detectar orientación primero
      if (this.config.isOpenSize) {
        detectedOrientation = this.detectOrientation(firstPageDimensions);
      }

      matchedSize = this.findMatchingSize(
        firstPageDimensions,
        this.config.paperSizes,
        detectedOrientation
      );

      if (!matchedSize) {
        errors.push({
          type: 'dimensions',
          message:
            'Las dimensiones del archivo no coinciden con ningún tamaño disponible',
          expected: this.getAvailableSizesMessage(),
          actual: `${firstPageDimensions.width}x${firstPageDimensions.height}mm`,
        });
      }
    }

    // Validar que todas las páginas tengan las mismas dimensiones
    const inconsistentPages =
      this.findInconsistentPageDimensions(pageDimensions);
    if (inconsistentPages.length > 0) {
      errors.push({
        type: 'dimensions',
        message: 'Todas las páginas deben tener las mismas dimensiones',
        expected: `${firstPageDimensions.width}x${firstPageDimensions.height}mm`,
        actual: inconsistentPages
          .map((d) => `${d.width}x${d.height}mm`)
          .join(', '),
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      detectedOrientation,
      matchedSize,
    };
  }

  /**
   * Busca un tamaño que coincida con las dimensiones dadas considerando sangría y tamaño abierto
   */
  private findMatchingSize(
    dimensions: PageDimensions,
    availableSizes: PaperSizeOption[],
    detectedOrientation?: OrientationType
  ): PaperSizeOption | undefined {
    return availableSizes.find((size) => {
      const expectedDimensions = this.getExpectedFileDimensions(
        size,
        detectedOrientation
      );
      return (
        expectedDimensions.width === dimensions.width &&
        expectedDimensions.height === dimensions.height
      );
    });
  }

  /**
   * Encuentra páginas con dimensiones inconsistentes
   */
  private findInconsistentPageDimensions(
    pageDimensions: PageDimensions[]
  ): PageDimensions[] {
    const firstPage = pageDimensions[0];
    return pageDimensions.filter(
      (page) =>
        page.width !== firstPage.width || page.height !== firstPage.height
    );
  }

  /**
   * Verifica si el número de páginas es válido
   */
  private isValidPageCount(pages: number): boolean {
    return this.config.allowedPages.includes(pages);
  }

  /**
   * Genera el mensaje de error para el número de páginas
   */
  private getPageCountErrorMessage(): string {
    const allowedPagesStr = this.config.allowedPages.join(' o ');
    return `El archivo debe tener ${allowedPagesStr} página${
      this.config.allowedPages.length > 1 ? 's' : ''
    }`;
  }

  /**
   * Genera el mensaje con los tamaños disponibles mostrando las dimensiones finales esperadas
   */
  private getAvailableSizesMessage(): string {
    if (this.config.orientationSizes) {
      const messages: string[] = [];
      Object.entries(this.config.orientationSizes).forEach(
        ([orientation, sizes]) => {
          if (sizes && sizes.length > 0) {
            const orientationType = orientation as OrientationType;
            const sizesList = sizes
              .map((s) => {
                const expectedDimensions = this.getExpectedFileDimensions(
                  s,
                  orientationType
                );
                return `${expectedDimensions.width}x${
                  expectedDimensions.height
                }mm (${s.name}${
                  this.config.requiresBleed ? ' con sangría' : ''
                }${this.config.isOpenSize ? ' abierto' : ''})`;
              })
              .join(', ');
            messages.push(`${orientation}: ${sizesList}`);
          }
        }
      );
      return messages.join('; ');
    } else if (this.config.paperSizes) {
      return this.config.paperSizes
        .map((s) => {
          const expectedDimensions = this.getExpectedFileDimensions(s);
          return `${expectedDimensions.width}x${expectedDimensions.height}mm (${
            s.name
          }${this.config.requiresBleed ? ' con sangría' : ''}${
            this.config.isOpenSize ? ' abierto' : ''
          })`;
        })
        .join(', ');
    }
    return '';
  }
}

// Factory para crear validadores según el tipo de producto
export class FileValidatorFactory {
  /**
   * Crea un validador para flyers
   */
  static createFlyerValidator(flyerOptions: any): FileValidator {
    return new FileValidator({
      productType: ProductType.FLYERS,
      allowedPages: [1, 2],
      paperSizes: flyerOptions.paperSize?.filter(
        (size: any) =>
          size.code !== 'personalizado' && size.width && size.height
      ),
      printFormMapping: {
        onePage: 'una-cara',
        twoPages: 'doble-cara',
      },
      requiresBleed: true,
      isOpenSize: false, // Los flyers NO se doblan, son tamaño final directo
    });
  }

  /**
   * Crea un validador para carpetas
   */
  static createCarpetaValidator(carpetaOptions: any): FileValidator {
    return new FileValidator({
      productType: ProductType.CARPETAS,
      allowedPages: [1, 2],
      paperSizes: carpetaOptions.paperSize?.filter(
        (size: any) => size.width && size.height
      ),
      printFormMapping: {
        onePage: 'una-cara',
        twoPages: 'doble-cara',
      },
      requiresBleed: true,
      isOpenSize: true, // Las carpetas SÍ se doblan, requieren tamaño abierto
    });
  }

  /**
   * Crea un validador para dípticos
   */
  static createDipticoValidator(dipticoOptions: any): FileValidator {
    return new FileValidator({
      productType: ProductType.DIPTICOS,
      allowedPages: [2],
      orientationSizes: {
        vertical: dipticoOptions.vertical_size,
        horizontal: dipticoOptions.horizontal_size,
        cuadrado: dipticoOptions.square_size,
      },
      requiresBleed: true,
      isOpenSize: true, // Los dípticos SÍ se doblan, requieren tamaño abierto
    });
  }

  static createMagazineValidator(magazineOptions: any): FileValidator {
    return new FileValidator({
      productType: ProductType.REVISTAS,
      allowedPages: [8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52],
      orientationSizes: {
        vertical: magazineOptions.vertical_size,
        horizontal: magazineOptions.horizontal_size,
        cuadrado: magazineOptions.square_size,
      },
      requiresBleed: true,
      isOpenSize: false,
    });
  }

  /**
   * Crea un validador para trípticos
   */
  static createTripticoValidator(tripticoOptions: any): FileValidator {
    return new FileValidator({
      productType: ProductType.TRIPTICOS,
      allowedPages: [2],
      orientationSizes: {
        vertical: tripticoOptions.vertical_size,
        horizontal: tripticoOptions.horizontal_size,
        cuadrado: tripticoOptions.square_size,
      },
      requiresBleed: true,
      isOpenSize: true, // Los trípticos se consideran tamaño abierto
    });
  }

  /**
   * Crea un validador para tarjetas de visita
   */
  static createTarjetaVisitaValidator(
    tarjetaVisitaOptions: any
  ): FileValidator {
    return new FileValidator({
      productType: ProductType.TARJETAS_VISITA,
      allowedPages: [1, 2],
      paperSizes: [
        {
          code: 'tarjeta-visita-standard',
          name: 'Tarjeta de visita estándar',
          width: 85,
          height: 55,
          description: '85x55mm',
        },
      ],
      printFormMapping: {
        onePage: 'una-cara',
        twoPages: 'doble-cara',
      },
      requiresBleed: true,
      isOpenSize: false, // Las tarjetas de visita usan tamaño cerrado
    });
  }

  /**
   * Crea un validador para rollups
   */
  static createRollupValidator(rollupOptions: any): FileValidator {
    return new FileValidator({
      productType: ProductType.ROLL_UPS, // Usamos FLYERS como tipo base para rollups
      allowedPages: [1], // Los rollups solo permiten una página
      paperSizes: rollupOptions.paperSize.map((size: any) => ({
        code: size.code,
        name: size.name,
        width: size.width,
        height: size.height,
        description: size.name,
      })),
      requiresBleed: true,
      isOpenSize: false, // Los rollups usan tamaño cerrado
    });
  }

  /**
   * Crea un validador para carteles
   */
  static createCartelValidator(cartelOptions: any): FileValidator {
    return new FileValidator({
      productType: ProductType.FLYERS, // Usamos FLYERS como tipo base para carteles
      allowedPages: [1], // Los carteles solo permiten una página (impresión por una cara)
      paperSizes: cartelOptions.paperSize?.filter(
        (size: any) =>
          size.code !== 'personalizado' && size.width && size.height
      ),
      requiresBleed: true,
      isOpenSize: false, // Los carteles usan tamaño cerrado
    });
  }
}
