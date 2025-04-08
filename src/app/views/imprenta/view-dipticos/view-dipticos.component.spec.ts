import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDipticosComponent } from './view-dipticos.component';

describe('ViewDipticosComponent', () => {
  let component: ViewDipticosComponent;
  let fixture: ComponentFixture<ViewDipticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDipticosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDipticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
