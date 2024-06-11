import { TestBed } from '@angular/core/testing';

import { OrdersService } from './orders.service';
import { HttpClient } from '@angular/common/http';

describe('OrdersService', () => {
  let service: OrdersService;
  const http = jasmine.createSpyObj('HttpClient', ['post']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: http }],
    });
    service = TestBed.inject(OrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
