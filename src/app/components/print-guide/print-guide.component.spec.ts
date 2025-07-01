import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintGuideComponent } from './print-guide.component';

describe('PrintGuideComponent', () => {
  let component: PrintGuideComponent;
  let fixture: ComponentFixture<PrintGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintGuideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
