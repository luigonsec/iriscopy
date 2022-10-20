import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalCommentComponent } from './additional-comment.component';

describe('AdditionalCommentComponent', () => {
  let component: AdditionalCommentComponent;
  let fixture: ComponentFixture<AdditionalCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
