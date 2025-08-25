import {
  FileValidator,
  FileValidatorFactory,
  OrientationType,
  ProductType,
} from './file-validator';
import File, { PageDimensions } from '../interfaces/File';
import dipticosOptions from '../../config/dipticos';
import flyerOptions from '../../config/flyers';
import tripticoOptions from '../../config/tripticos';
import rollupsOptions from '../../config/rollups';

describe('FileValidator', () => {
  let validator: FileValidator;
  let mockFile: File;

  beforeEach(() => {
    // Crear un archivo mock básico
    mockFile = {
      id: '1',
      name: 'test.pdf',
      size: 1024,
      pages: 2,
      url: 'http://example.com/test.pdf',
      original_filename: 'test.pdf',
      source: 'upload',
      image: 'data:image/png;base64,test',
      pageDimensions: [],
    };
  });

  describe('FileValidatorFactory', () => {
    it('should create a diptico validator with correct configuration', () => {
      const validator =
        FileValidatorFactory.createDipticoValidator(dipticosOptions);
      expect(validator).toBeDefined();
    });

    it('should create a triptico validator with correct configuration', () => {
      const validator =
        FileValidatorFactory.createTripticoValidator(tripticoOptions);
      expect(validator).toBeDefined();
    });

    it('should create a flyer validator with correct configuration', () => {
      const validator = FileValidatorFactory.createFlyerValidator(flyerOptions);
      expect(validator).toBeDefined();
    });

    it('should create a rollup validator with correct configuration', () => {
      const validator =
        FileValidatorFactory.createRollupValidator(rollupsOptions);
      expect(validator).toBeDefined();
    });
  });

  describe('Diptico Validator', () => {
    beforeEach(() => {
      validator = FileValidatorFactory.createDipticoValidator(dipticosOptions);
    });

    describe('A7 Diptico Validation', () => {
      it('should accept A7 diptico with correct dimensions (154x111mm)', () => {
        // A7 cerrado: 74x105mm
        // A7 abierto: 148x105mm (74*2 x 105)
        // Con sangría: 154x111mm (148+6 x 105+6)
        mockFile.pageDimensions = [{ width: 154, height: 111 }];

        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
        expect(result.detectedOrientation).toBe(OrientationType.VERTICAL);
        expect(result.matchedSize).toBeDefined();
        expect(result.matchedSize?.code).toBe('a7');
      });

      it('should accept A7 diptico with exact dimensions without bleed (148x105mm)', () => {
        // A7 abierto sin sangría: 148x105mm
        mockFile.pageDimensions = [{ width: 148, height: 105 }];

        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(false); // Debería requerir sangría
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    describe('10x21 Diptico Validation', () => {
      it('should accept 10x21 diptico with correct dimensions (206x216mm)', () => {
        // 10x21 cerrado: 100x210mm
        // 10x21 abierto: 200x210mm (100*2 x 210)
        // Con sangría: 206x216mm (200+6 x 210+6)
        mockFile.pageDimensions = [{ width: 206, height: 216 }];

        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
        expect(result.detectedOrientation).toBe(OrientationType.VERTICAL);
        expect(result.matchedSize).toBeDefined();
        expect(result.matchedSize?.code).toBe('10x21');
      });
    });

    describe('A6 Horizontal Diptico Validation', () => {
      it('should accept A6 horizontal diptico with correct dimensions', () => {
        // A6 horizontal cerrado: 148x105mm
        // A6 horizontal abierto: 296x105mm (148*2 x 105)
        // Con sangría: 302x111mm (296+6 x 105+6)
        mockFile.pageDimensions = [{ width: 302, height: 111 }];

        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
        expect(result.detectedOrientation).toBe(OrientationType.HORIZONTAL);
        expect(result.matchedSize).toBeDefined();
        expect(result.matchedSize?.code).toBe('a6-horizontal');
      });
    });

    describe('A6 Cuadrado Diptico Validation', () => {
      it('should accept A6 cuadrado diptico with correct dimensions', () => {
        // A6 cuadrado cerrado: 105x105mm
        // A6 cuadrado abierto: 210x105mm (105*2 x 105)
        // Con sangría: 216x111mm (210+6 x 105+6)
        mockFile.pageDimensions = [{ width: 216, height: 111 }];

        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
        expect(result.detectedOrientation).toBe(OrientationType.CUADRADO);
        expect(result.matchedSize).toBeDefined();
        expect(result.matchedSize?.code).toBe('a6-cuadrado');
      });
    });

    describe('Invalid Dimensions', () => {
      it('should reject diptico with invalid dimensions', () => {
        mockFile.pageDimensions = [{ width: 100, height: 50 }]; // Dimensiones incorrectas

        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0].type).toBe('dimensions');
      });

      it('should reject diptico with inconsistent page dimensions', () => {
        mockFile.pageDimensions = [
          { width: 154, height: 111 },
          { width: 200, height: 150 }, // Dimensiones diferentes
        ];

        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    describe('Page Count Validation', () => {
      it('should accept diptico with 2 pages', () => {
        mockFile.pages = 2;
        mockFile.pageDimensions = [
          { width: 154, height: 111 },
          { width: 154, height: 111 },
        ];

        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(true);
      });

      it('should reject diptico with wrong page count', () => {
        mockFile.pages = 1;
        mockFile.pageDimensions = [{ width: 154, height: 111 }];

        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.type === 'pages')).toBe(true);
      });

      it('should reject diptico with too many pages', () => {
        mockFile.pages = 3;
        mockFile.pageDimensions = [
          { width: 154, height: 111 },
          { width: 154, height: 111 },
          { width: 154, height: 111 },
        ];

        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.type === 'pages')).toBe(true);
      });
    });
  });

  describe('Orientation Detection', () => {
    beforeEach(() => {
      validator = FileValidatorFactory.createDipticoValidator(dipticosOptions);
    });

    it('should detect vertical orientation correctly', () => {
      // Un archivo más alto que ancho debería ser vertical
      mockFile.pageDimensions = [{ width: 154, height: 111 }]; // A7 abierto con sangría

      const result = validator.validateFile(mockFile);

      expect(result.detectedOrientation).toBe(OrientationType.VERTICAL);
    });

    it('should detect horizontal orientation correctly', () => {
      // A6 horizontal: 296x105mm abierto + sangría = 302x111mm
      mockFile.pageDimensions = [{ width: 302, height: 111 }];

      const result = validator.validateFile(mockFile);

      expect(result.detectedOrientation).toBe(OrientationType.HORIZONTAL);
    });

    it('should detect square orientation correctly', () => {
      // A6 cuadrado: 210x105mm abierto + sangría = 216x111mm
      mockFile.pageDimensions = [{ width: 216, height: 111 }];

      const result = validator.validateFile(mockFile);

      expect(result.detectedOrientation).toBe(OrientationType.CUADRADO);
    });
  });

  describe('Size Matching Logic', () => {
    beforeEach(() => {
      validator = FileValidatorFactory.createDipticoValidator(dipticosOptions);
    });

    it('should find matching size in all orientations for open size products', () => {
      // Test que verifica que se busque en todas las orientaciones
      const testCases = [
        {
          dimensions: { width: 154, height: 111 },
          expectedCode: 'a7',
          expectedOrientation: OrientationType.VERTICAL,
        },
        {
          dimensions: { width: 302, height: 111 },
          expectedCode: 'a6-horizontal',
          expectedOrientation: OrientationType.HORIZONTAL,
        },
        {
          dimensions: { width: 216, height: 111 },
          expectedCode: 'a6-cuadrado',
          expectedOrientation: OrientationType.CUADRADO,
        },
      ];

      testCases.forEach((testCase) => {
        mockFile.pageDimensions = [testCase.dimensions];
        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(true);
        expect(result.matchedSize?.code).toBe(testCase.expectedCode);
        expect(result.detectedOrientation).toBe(testCase.expectedOrientation);
      });
    });
  });

  describe('Bleed Calculation', () => {
    beforeEach(() => {
      validator = FileValidatorFactory.createDipticoValidator(dipticosOptions);
    });

    it('should calculate correct dimensions with bleed', () => {
      // Verificar que se calcula correctamente la sangría
      const testCases = [
        {
          input: { width: 154, height: 111 }, // A7 con sangría
          expected: { closedWidth: 74, closedHeight: 105 }, // A7 cerrado
        },
        {
          input: { width: 206, height: 216 }, // 10x21 con sangría
          expected: { closedWidth: 100, closedHeight: 210 }, // 10x21 cerrado
        },
      ];

      testCases.forEach((testCase) => {
        mockFile.pageDimensions = [testCase.input];
        const result = validator.validateFile(mockFile);

        expect(result.isValid).toBe(true);
        expect(result.matchedSize?.width).toBe(testCase.expected.closedWidth);
        expect(result.matchedSize?.height).toBe(testCase.expected.closedHeight);
      });
    });
  });

  describe('Error Messages', () => {
    beforeEach(() => {
      validator = FileValidatorFactory.createDipticoValidator(dipticosOptions);
    });

    it('should provide helpful error messages for invalid dimensions', () => {
      mockFile.pageDimensions = [{ width: 100, height: 50 }];

      const result = validator.validateFile(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain(
        'No se encontró un tamaño válido'
      );
      expect(result.errors[0].actual).toBe('100x50mm');
    });

    it('should provide helpful error messages for wrong page count', () => {
      mockFile.pages = 1;
      mockFile.pageDimensions = [{ width: 154, height: 111 }];

      const result = validator.validateFile(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.type === 'pages')).toBe(true);
    });
  });

  describe('Rollup Validator', () => {
    beforeEach(() => {
      validator = FileValidatorFactory.createRollupValidator(rollupsOptions);
    });

    it('should validate a correct rollup file', () => {
      mockFile.pages = 1;
      mockFile.pageDimensions = [{ width: 850, height: 2050 }]; // 85x205 sin sangría

      const result = validator.validateFile(mockFile);

      expect(result.isValid).toBe(true);
      expect(result.matchedSize).toBeDefined();
      expect(result.matchedSize?.code).toBe('85x205');
    });

    it('should detect correct rollup size for 100x205', () => {
      mockFile.pages = 1;
      mockFile.pageDimensions = [{ width: 1000, height: 2050 }]; // 100x205 sin sangría

      const result = validator.validateFile(mockFile);

      expect(result.isValid).toBe(true);
      expect(result.matchedSize).toBeDefined();
      expect(result.matchedSize?.code).toBe('100x205');
    });

    it('should reject files with wrong page count', () => {
      mockFile.pages = 2;
      mockFile.pageDimensions = [{ width: 850, height: 2050 }];

      const result = validator.validateFile(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.type === 'pages')).toBe(true);
    });

    it('should reject files with wrong dimensions', () => {
      mockFile.pages = 1;
      mockFile.pageDimensions = [{ width: 100, height: 100 }];

      const result = validator.validateFile(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.type === 'dimensions')).toBe(true);
    });
  });
});
