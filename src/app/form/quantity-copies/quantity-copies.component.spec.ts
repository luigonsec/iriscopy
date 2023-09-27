import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityCopiesComponent } from './quantity-copies.component';

describe('QuantityCopiesComponent', () => {
	let component: QuantityCopiesComponent;
	let fixture: ComponentFixture<QuantityCopiesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ QuantityCopiesComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(QuantityCopiesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
