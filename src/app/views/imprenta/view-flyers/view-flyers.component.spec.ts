import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFlyersComponent } from './view-flyers.component';

describe('ViewFlyersComponent', () => {
  let component: ViewFlyersComponent;
  let fixture: ComponentFixture<ViewFlyersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFlyersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFlyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
