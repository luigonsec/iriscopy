import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTarjetasVisitaComponent } from './view-tarjetas-visita.component';

describe('ViewTarjetasVisitaComponent', () => {
  let component: ViewTarjetasVisitaComponent;
  let fixture: ComponentFixture<ViewTarjetasVisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTarjetasVisitaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTarjetasVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
