import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperTypeComponent } from './paper-type.component';

describe('PaperTypeComponent', () => {
  let component: PaperTypeComponent;
  let fixture: ComponentFixture<PaperTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaperTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
