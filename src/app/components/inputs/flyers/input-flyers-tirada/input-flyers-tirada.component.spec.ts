import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFlyersTiradaComponent } from './input-flyers-tirada.component';

describe('InputFlyersTiradaComponent', () => {
  let component: InputFlyersTiradaComponent;
  let fixture: ComponentFixture<InputFlyersTiradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFlyersTiradaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFlyersTiradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
