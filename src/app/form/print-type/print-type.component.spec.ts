import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTypeComponent } from './print-type.component';

describe('PrintTypeComponent', () => {
  let component: PrintTypeComponent;
  let fixture: ComponentFixture<PrintTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
