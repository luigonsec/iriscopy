import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishTypeComponent } from './finish-type.component';

describe('FinishTypeComponent', () => {
  let component: FinishTypeComponent;
  let fixture: ComponentFixture<FinishTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
