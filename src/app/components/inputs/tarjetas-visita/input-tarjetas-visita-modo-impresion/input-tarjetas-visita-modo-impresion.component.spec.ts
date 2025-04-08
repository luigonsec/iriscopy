import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTarjetasVisitaModoImpresionComponent } from './input-tarjetas-visita-modo-impresion.component';

describe('InputTarjetasVisitaModoImpresionComponent', () => {
  let component: InputTarjetasVisitaModoImpresionComponent;
  let fixture: ComponentFixture<InputTarjetasVisitaModoImpresionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputTarjetasVisitaModoImpresionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTarjetasVisitaModoImpresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
