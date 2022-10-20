import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorOptionComponent } from './color-option.component';

describe('ColorOptionComponent', () => {
  let component: ColorOptionComponent;
  let fixture: ComponentFixture<ColorOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
