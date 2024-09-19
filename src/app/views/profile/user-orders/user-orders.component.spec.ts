import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrdersComponent } from './user-orders.component';
import { LoadingService } from 'src/app/services/loading.service';
import { DialogService } from 'primeng/dynamicdialog';
import { OrdersService } from 'src/app/services/orders.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('UserOrdersComponent', () => {
  let component: UserOrdersComponent;
  let fixture: ComponentFixture<UserOrdersComponent>;
  let mockOrderService: jasmine.SpyObj<OrdersService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockLoading: jasmine.SpyObj<LoadingService>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockOrderService = jasmine.createSpyObj('OrdersService', ['getByCustomer']);
    mockOrderService.getByCustomer.and.returnValue(of([]));

    mockStore = jasmine.createSpyObj('Store', ['select']);
    mockDialogService = jasmine.createSpyObj('DialogService', ['open']);
    mockStore.select.and.returnValue(of({}));

    mockLoading = jasmine.createSpyObj('LoadingService', [
      'setLoading',
      'stopLoading',
    ]);

    await TestBed.configureTestingModule({
      declarations: [UserOrdersComponent],
      providers: [
        { provide: OrdersService, useValue: mockOrderService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: LoadingService, useValue: mockLoading },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
