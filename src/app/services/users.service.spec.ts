import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { HttpClient } from '@angular/common/http';

describe('UsersService', () => {
  let service: UsersService;
  let http: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: http,
        },
      ],
    });
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
