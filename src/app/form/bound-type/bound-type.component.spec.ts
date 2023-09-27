import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundTypeComponent } from './bound-type.component';

describe('BoundTypeComponent', () => {
	let component: BoundTypeComponent;
	let fixture: ComponentFixture<BoundTypeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ BoundTypeComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BoundTypeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
