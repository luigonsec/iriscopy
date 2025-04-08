import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRollupsComponent } from './view-rollups.component';

describe('ViewRollupsComponent', () => {
  let component: ViewRollupsComponent;
  let fixture: ComponentFixture<ViewRollupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRollupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRollupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
