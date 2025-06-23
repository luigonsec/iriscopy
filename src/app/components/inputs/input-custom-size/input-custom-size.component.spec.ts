import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputCustomSizeComponent } from './input-custom-size.component';

describe('InputCustomSizeComponent', () => {
  let component: InputCustomSizeComponent;
  let fixture: ComponentFixture<InputCustomSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputCustomSizeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputCustomSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
