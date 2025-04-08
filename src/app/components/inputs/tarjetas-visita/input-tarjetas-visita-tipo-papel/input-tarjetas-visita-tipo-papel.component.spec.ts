import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTarjetasVisitaTipoPapelComponent } from './input-tarjetas-visita-tipo-papel.component';

describe('InputTarjetasVisitaTipoPapelComponent', () => {
  let component: InputTarjetasVisitaTipoPapelComponent;
  let fixture: ComponentFixture<InputTarjetasVisitaTipoPapelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputTarjetasVisitaTipoPapelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTarjetasVisitaTipoPapelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
