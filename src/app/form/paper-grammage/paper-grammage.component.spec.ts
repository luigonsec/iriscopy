import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperGrammageComponent } from './paper-grammage.component';

describe('PaperGrammageComponent', () => {
	let component: PaperGrammageComponent;
	let fixture: ComponentFixture<PaperGrammageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ PaperGrammageComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PaperGrammageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
