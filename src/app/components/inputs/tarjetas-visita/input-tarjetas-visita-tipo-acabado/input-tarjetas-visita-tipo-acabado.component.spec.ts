import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTarjetasVisitaTipoAcabadoComponent } from './input-tarjetas-visita-tipo-acabado.component';

describe('InputTarjetasVisitaTipoAcabadoComponent', () => {
  let component: InputTarjetasVisitaTipoAcabadoComponent;
  let fixture: ComponentFixture<InputTarjetasVisitaTipoAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputTarjetasVisitaTipoAcabadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTarjetasVisitaTipoAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
