import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderComponent } from './order.component';
import { OrderItem } from 'src/app/interfaces/OrderItem';
import { OrdersService } from 'src/app/services/orders.service';
import File from 'src/app/interfaces/File';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { of } from 'rxjs';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let orderService;
  let shopcartService;

  beforeEach(async () => {
    orderService = jasmine.createSpyObj('OrdersService', ['getPrecio']);
    shopcartService = jasmine.createSpyObj('ShopcartService', [
      'update',
      'getCart',
      'getCart$',
    ]);
    shopcartService.getCart$.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      providers: [
        { provide: OrdersService, useValue: orderService },
        { provide: ShopcartService, useValue: shopcartService },
      ],
      declarations: [OrderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTotalPrice', () => {
    it('should calculate total price correctly', () => {
      spyOn(component, 'getPrice').and.returnValue(10);
      component.orders = [{} as OrderItem];

      const price = component.getTotalPrice();

      expect(price).toBe(10);
    });

    it('should calculate total price correctly with more than one order', () => {
      spyOn(component, 'getPrice').and.returnValue(10);
      component.orders = [{} as OrderItem, {} as OrderItem, {} as OrderItem];

      const price = component.getTotalPrice();

      expect(price).toBe(30);
    });
  });

  describe('getPrice', () => {
    it('should calculate total price correctly', () => {
      orderService.getPrecio.and.returnValue(10);

      const price = component.getPrice({} as OrderItem);

      expect(price).toBe(10);
    });
  });

  describe('removeFile', () => {
    it('should remove the file in the order', () => {
      shopcartService.update.and.returnValue(undefined);
      component.orders = [
        {
          id: 'id1',
          files: [{ id: 1 }, { id: 3 }],
        },
        {
          id: 'id2',
          files: [{ id: 2 }],
        },
      ] as OrderItem[];

      component.removeFile('id1', 1);

      expect(component.orders).toEqual([
        {
          id: 'id1',
          files: [{ id: 3 }],
        },
        {
          id: 'id2',
          files: [{ id: 2 } as File],
        },
      ] as OrderItem[]);
    });

    it('should remove the order when the last file in the order is removed', () => {
      shopcartService.update.and.returnValue(undefined);
      component.orders = [
        {
          id: 'id1',
          files: [{ id: 1 }],
        },
        {
          id: 'id2',
          files: [{ id: 2 }],
        },
      ] as OrderItem[];

      component.removeFile('id1', 1);

      expect(component.orders).toEqual([
        {
          id: 'id2',
          files: [{ id: 2 } as File],
        },
      ] as OrderItem[]);
    });
  });
});
