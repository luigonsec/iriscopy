import { TestBed } from '@angular/core/testing';

import { OrdersService } from './orders.service';
import { OrderItem } from '../interfaces/OrderItem';
import { HttpClient } from '@angular/common/http';

fdescribe('OrdersService', () => {
  let service: OrdersService;
  let http = jasmine.createSpyObj('HttpClient', ['post']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: http }],
    });
    service = TestBed.inject(OrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPrecio', () => {
    it('calcular el precio correctamente de un archivo de 2 páginas, impreso a doble cara, en blanco y negro', () => {
      const order = {
        printForm: { factor: 1, code: 'doble-cara' },
        files: [{ pages: 2 }],
        pagesPerSide: { factor: 1, code: '1_vertical' },
        printType: { code: 'blanco-negro' },
        paperSize: { code: 'A4' },
        paperGrammage: { factor: 0 },
        boundType: { code: 'individual' },
        finishType: { code: 'sin-acabado', factor: 0 },
        boundColors: {
          anillas: { factor: 0.25 },
          trasera: { factor: 0.25 },
          delantera: { factor: 0.25 },
        },
        copiesQuantity: 1,
      } as OrderItem;
      const expectedPrice = 0.07;
      const outputPrice = service.getPrecio(order, [order]);

      expect(outputPrice).toEqual(expectedPrice);
    });

    it('calcula el precio correctamente de una copias de 5 archivos de 5 y 10, 15, 20 y 30 páginas (80 páginas), a una cara, A4, blanco y negro, papel normal, encuadernado individual y anillas y tapas grofadas', () => {
      const order = {
        printForm: { factor: 1, code: 'una-cara' },
        files: [
          { pages: 5 },
          { pages: 10 },
          { pages: 15 },
          { pages: 20 },
          { pages: 30 },
        ],
        pagesPerSide: { factor: 1, code: '1_vertical' },
        printType: { code: 'blanco-negro' },
        paperSize: { code: 'A4' },
        paperGrammage: { factor: 0 },
        boundType: { code: 'individual' },
        finishType: { code: 'encuadernado', factor: 1.2 },
        boundColors: {
          anillas: { factor: 0.25 },
          trasera: { factor: 0.25 },
          delantera: { factor: 0.25 },
        },
        copiesQuantity: 1,
      } as OrderItem;
      const expectedPrice = 12.79;
      const outputPrice = service.getPrecio(order, [order]);

      expect(outputPrice).toEqual(expectedPrice);
    });

    it('calcula el precio correctamente de dos copias de dos archivos de 5 y 10 páginas (30 páginas), a una cara, A4, blanco y negro, papel normal, encuadernado individual y anillas y tapas grofadas', () => {
      const order = {
        printForm: { factor: 1, code: 'una-cara' },
        files: [{ pages: 10 }, { pages: 5 }],
        pagesPerSide: { factor: 1, code: '1_vertical' },
        printType: { code: 'blanco-negro' },
        paperSize: { code: 'A4' },
        paperGrammage: { factor: 0 },
        boundType: { code: 'individual' },
        finishType: { code: 'encuadernado', factor: 1.2 },
        boundColors: {
          anillas: { factor: 0.25 },
          trasera: { factor: 0.25 },
          delantera: { factor: 0.25 },
        },
        copiesQuantity: 2,
      } as OrderItem;
      const expectedPrice = 9;
      const outputPrice = service.getPrecio(order, [order]);

      expect(outputPrice).toEqual(expectedPrice);
    });

    it('calcula el precio correctamente de cuatro copias de dos archivos de 5 y 10 páginas (60 páginas), a una cara, A4, color, papel fotográfico, encuadernado agrupado y anillas y tapas grofadas', () => {
      const order = {
        printForm: { factor: 1, code: 'una-cara' },
        files: [{ pages: 10 }, { pages: 5 }],
        pagesPerSide: { factor: 1, code: '1_vertical' },
        printType: { code: 'color' },
        paperSize: { code: 'A4' },
        paperGrammage: { code: 'fotografico', factor: 0.15 },
        boundType: { code: 'agrupados' },
        finishType: { code: 'encuadernado', factor: 1.2 },
        boundColors: {
          anillas: { factor: 0.25 },
          trasera: { factor: 0.25 },
          delantera: { factor: 0.25 },
        },
        copiesQuantity: 4,
      } as OrderItem;
      const expectedPrice = 18.15;
      const outputPrice = service.getPrecio(order, [order]);

      expect(outputPrice).toEqual(expectedPrice);
    });

    it('calcula el precio correctamente de cuatro copias de dos archivos de 5 y 10 páginas (60 páginas), separados en dos pedidos, a una cara, A4, color, papel fotográfico, encuadernado agrupado y anillas y tapas grofadas', () => {
      const order_1 = {
        printForm: { factor: 1, code: 'una-cara' },
        files: [{ pages: 10 }, { pages: 5 }],
        pagesPerSide: { factor: 1, code: '1_vertical' },
        printType: { code: 'color' },
        paperSize: { code: 'A4' },
        paperGrammage: { code: 'fotografico', factor: 0.15 },
        boundType: { code: 'agrupados' },
        finishType: { code: 'encuadernado', factor: 1.2 },
        boundColors: {
          anillas: { factor: 0.25 },
          trasera: { factor: 0.25 },
          delantera: { factor: 0.25 },
        },
        copiesQuantity: 2,
      } as OrderItem;

      const order_2 = {
        printForm: { factor: 1, code: 'una-cara' },
        files: [{ pages: 10 }, { pages: 5 }],
        pagesPerSide: { factor: 1, code: '1_vertical' },
        printType: { code: 'color' },
        paperSize: { code: 'A4' },
        paperGrammage: { code: 'fotografico', factor: 0.15 },
        boundType: { code: 'agrupados' },
        finishType: { code: 'encuadernado', factor: 1.2 },
        boundColors: {
          anillas: { factor: 0.25 },
          trasera: { factor: 0.25 },
          delantera: { factor: 0.25 },
        },
        copiesQuantity: 2,
      } as OrderItem;
      const expectedPrice = 10.05;
      const outputPrice = service.getPrecio(order_1, [order_1, order_2]);

      expect(outputPrice).toEqual(expectedPrice);
    });

    it('cuando hay dos pedidos calcula el precio correctamente de el primer pedido: 2 copias de 2 archivos de 5 y 10 páginas (30 páginas), a una cara, A4, blanco y negro, papel fotográfico, encuadernado agrupado y anillas y tapas grofadas', () => {
      const order_1 = {
        printForm: { factor: 1, code: 'una-cara' },
        files: [{ pages: 10 }, { pages: 5 }],
        pagesPerSide: { factor: 1, code: '1_vertical' },
        printType: { code: 'blanco-negro' },
        paperSize: { code: 'A4' },
        paperGrammage: { code: 'fotografico', factor: 0.15 },
        boundType: { code: 'agrupados' },
        finishType: { code: 'encuadernado', factor: 1.2 },
        boundColors: {
          anillas: { factor: 0.25 },
          trasera: { factor: 0.25 },
          delantera: { factor: 0.25 },
        },
        copiesQuantity: 2,
      } as OrderItem;

      const order_2 = {
        printForm: { factor: 1, code: 'una-cara' },
        files: [{ pages: 10 }, { pages: 5 }],
        pagesPerSide: { factor: 1, code: '1_vertical' },
        printType: { code: 'color' },
        paperSize: { code: 'A4' },
        paperGrammage: { code: 'fotografico', factor: 0.15 },
        boundType: { code: 'agrupados' },
        finishType: { code: 'encuadernado', factor: 1.2 },
        boundColors: {
          anillas: { factor: 0.25 },
          trasera: { factor: 0.25 },
          delantera: { factor: 0.25 },
        },
        copiesQuantity: 5,
      } as OrderItem;
      const expectedPrice = 7.65;
      const outputPrice = service.getPrecio(order_1, [order_1, order_2]);

      expect(outputPrice).toEqual(expectedPrice);
    });

    it('cuando hay dos pedidos calcula el precio correctamente de el segundo pedido: 5 copias de 3 archivos de 5, 10 y 1 páginas (80 páginas), a una cara, A4, color eco, papel cartulina, encuadernado individual y anillas y tapas normales', () => {
      const order_1 = {
        printForm: { factor: 1, code: 'una-cara' },
        files: [{ pages: 10 }, { pages: 5 }],
        pagesPerSide: { factor: 1, code: '1_vertical' },
        printType: { code: 'blanco-negro' },
        paperSize: { code: 'A4' },
        paperGrammage: { code: 'fotografico', factor: 0.15 },
        boundType: { code: 'agrupados' },
        finishType: { code: 'encuadernado', factor: 1.2 },
        boundColors: {
          anillas: { factor: 0.25 },
          trasera: { factor: 0.25 },
          delantera: { factor: 0.25 },
        },
        copiesQuantity: 2,
      } as OrderItem;

      const order_2 = {
        printForm: { factor: 1, code: 'una-cara' },
        files: [{ pages: 10 }, { pages: 5 }, { pages: 1 }],
        pagesPerSide: { factor: 1, code: '1_vertical' },
        printType: { code: 'color-eco' },
        paperSize: { code: 'A4' },
        paperGrammage: { code: 'cartulina', factor: 0.1 },
        boundType: { code: 'individual' },
        finishType: { code: 'encuadernado', factor: 1.2 },
        boundColors: {
          anillas: { factor: 0 },
          trasera: { factor: 0 },
          delantera: { factor: 0 },
        },
        copiesQuantity: 5,
      } as OrderItem;
      const expectedPrice = 32;
      const outputPrice = service.getPrecio(order_2, [order_1, order_2]);

      expect(outputPrice).toEqual(expectedPrice);
    });

    it('calcula el precio correctamente de un pedido: 2 copias de 2 archivos de 500 y 100 páginas (1200 páginas), a cuatro páginas por cara, a doble cara, A3, color, papel fotográfico, sin encuadernado', () => {
      const order = {
        printForm: { factor: 1, code: 'doble-cara' },
        files: [{ pages: 500 }, { pages: 100 }],
        pagesPerSide: { factor: 0.25, code: '4_horizontal' },
        printType: { code: 'color' },
        paperSize: { code: 'A3' },
        paperGrammage: { code: 'fotografico', factor: 0.15 },
        boundType: { code: 'agrupados' },
        finishType: { code: 'sin-acabado' },
        boundColors: {
          anillas: { factor: 0.25 },
          trasera: { factor: 0.25 },
          delantera: { factor: 0.25 },
        },
        copiesQuantity: 2,
      } as OrderItem;

      const expectedPrice = 113.4;
      const outputPrice = service.getPrecio(order, [order]);

      expect(outputPrice).toEqual(expectedPrice);
    });

    it('devuelve 0 si no se pasan parámetros válidos', () => {
      expect(service.getPrecio(null, [null])).toEqual(0);
      expect(service.getPrecio({} as OrderItem, [{} as OrderItem])).toEqual(0);
      expect(
        service.getPrecio({ files: [] } as OrderItem, [
          { files: [] } as OrderItem,
        ])
      ).toEqual(0);
    });
  });
});
