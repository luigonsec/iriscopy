import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundColorsComponent } from './bound-colors.component';

describe('BoundColorsComponent', () => {
  let component: BoundColorsComponent;
  let fixture: ComponentFixture<BoundColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoundColorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoundColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
