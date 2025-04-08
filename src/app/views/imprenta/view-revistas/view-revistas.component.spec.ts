import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRevistasComponent } from './view-revistas.component';

describe('ViewRevistasComponent', () => {
  let component: ViewRevistasComponent;
  let fixture: ComponentFixture<ViewRevistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRevistasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRevistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
