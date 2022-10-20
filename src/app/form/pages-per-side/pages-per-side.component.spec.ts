import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesPerSideComponent } from './pages-per-side.component';

describe('PagesPerSideComponent', () => {
  let component: PagesPerSideComponent;
  let fixture: ComponentFixture<PagesPerSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagesPerSideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesPerSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
