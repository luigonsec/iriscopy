import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsComponent } from './order-details.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

describe('OrderDetailsComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;
  let mockDialogConf: jasmine.SpyObj<DynamicDialogConfig>;
  beforeEach(async () => {
    mockDialogConf = jasmine.createSpyObj('DynamicDialogConfig', ['data']);
    mockDialogConf.data = { order: {} };
    await TestBed.configureTestingModule({
      declarations: [OrderDetailsComponent],
      providers: [
        {
          provide: DynamicDialogConfig,
          useValue: mockDialogConf,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
