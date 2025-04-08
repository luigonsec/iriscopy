import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFlyersCustomSizeComponent } from './input-flyers-custom-size.component';

describe('InputFlyersCustomSizeComponent', () => {
  let component: InputFlyersCustomSizeComponent;
  let fixture: ComponentFixture<InputFlyersCustomSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFlyersCustomSizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFlyersCustomSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
