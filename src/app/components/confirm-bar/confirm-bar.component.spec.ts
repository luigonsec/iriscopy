import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBarComponent } from './confirm-bar.component';

describe('ConfirmBarComponent', () => {
	let component: ConfirmBarComponent;
	let fixture: ComponentFixture<ConfirmBarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ConfirmBarComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
