import { TestBed } from '@angular/core/testing';

import { OrdersService } from './orders.service';
import Order from '../interfaces/Order';
import { OrderItem } from '../interfaces/OrderItem';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPrecio', () => {
    it('calcula el precio correctamente', () => {
      const order = {
        printForm: { factor: 0.5, code: 'carpeta' },
        files: [{ pages: 10 }, { pages: 5 }],
        pagesPerSide: { factor: 2 },
        printType: { code: 'color' },
        paperSize: { code: 'A4' },
        paperGrammage: { factor: 1 },
        boundType: { code: 'individual' },
        finishType: { code: 'encuadernado' },
        boundColors: {
          anillas: { factor: 0.5 },
          trasera: { factor: 0.3 },
          delantera: { factor: 0.2 },
        },
        copiesQuantity: 2,
      } as OrderItem;
      const expectedPrice = 150;
      expect(service.getPrecio(order)).toEqual(expectedPrice);
    });

    it('devuelve 0 si no se pasan parámetros válidos', () => {
      expect(service.getPrecio(null)).toEqual(0);
      expect(service.getPrecio({} as OrderItem)).toEqual(0);
      expect(service.getPrecio({ files: [] } as OrderItem)).toEqual(0);
    });
  });
});
