import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCartelesComponent } from './view-carteles.component';

describe('ViewCartelesComponent', () => {
  let component: ViewCartelesComponent;
  let fixture: ComponentFixture<ViewCartelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCartelesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCartelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
