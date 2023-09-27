import { TestBed } from '@angular/core/testing';

import { RedsysService } from './redsys.service';

describe('RedsysService', () => {
	let service: RedsysService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(RedsysService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
