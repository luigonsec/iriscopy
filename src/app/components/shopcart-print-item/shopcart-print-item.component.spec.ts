import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopcartPrintItemComponent } from './shopcart-print-item.component';

describe('ShopcartPrintItemComponent', () => {
  let component: ShopcartPrintItemComponent;
  let fixture: ComponentFixture<ShopcartPrintItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopcartPrintItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopcartPrintItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
