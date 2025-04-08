import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCarpetasComponent } from './view-carpetas.component';

describe('ViewCarpetasComponent', () => {
  let component: ViewCarpetasComponent;
  let fixture: ComponentFixture<ViewCarpetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCarpetasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCarpetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
