import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFlyersSizeComponent } from './input-flyers-size.component';

describe('InputFlyersSizeComponent', () => {
  let component: InputFlyersSizeComponent;
  let fixture: ComponentFixture<InputFlyersSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFlyersSizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFlyersSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
