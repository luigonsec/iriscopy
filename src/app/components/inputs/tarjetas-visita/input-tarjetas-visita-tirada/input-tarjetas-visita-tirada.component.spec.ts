import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTarjetasVisitaTiradaComponent } from './input-tarjetas-visita-tirada.component';

describe('InputTarjetasVisitaTiradaComponent', () => {
  let component: InputTarjetasVisitaTiradaComponent;
  let fixture: ComponentFixture<InputTarjetasVisitaTiradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputTarjetasVisitaTiradaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTarjetasVisitaTiradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
