import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTripticosComponent } from './view-tripticos.component';

describe('ViewTripticosComponent', () => {
  let component: ViewTripticosComponent;
  let fixture: ComponentFixture<ViewTripticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTripticosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTripticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
