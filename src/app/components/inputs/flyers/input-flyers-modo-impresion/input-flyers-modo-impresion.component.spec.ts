import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFlyersModoImpresionComponent } from './input-flyers-modo-impresion.component';

describe('InputFlyersModoImpresionComponent', () => {
  let component: InputFlyersModoImpresionComponent;
  let fixture: ComponentFixture<InputFlyersModoImpresionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFlyersModoImpresionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFlyersModoImpresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
