import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFlyersTipoPapelComponent } from './input-flyers-tipo-papel.component';

describe('InputFlyersTipoPapelComponent', () => {
  let component: InputFlyersTipoPapelComponent;
  let fixture: ComponentFixture<InputFlyersTipoPapelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFlyersTipoPapelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFlyersTipoPapelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
